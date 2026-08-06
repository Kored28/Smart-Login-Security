<?php

namespace SmartLoginSecurity\Api;

use SmartLoginSecurity\Security\Logger;

if (! defined('ABSPATH')) {
    die;
}

class LogsController {
    public function init(): void {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void {
        register_rest_route('smart-login-security/v1', '/logs', [
            'methods' => 'GET',
            'callback' => [$this, 'get_logs'],
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('smart-login-security/v1', '/logs/stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_stats'],
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('smart-login-security/v1', '/logs/daily', [
            'methods' => 'GET',
            'callback' => [$this, 'get_daily'],
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('smart-login-security/v1', '/logs/events', [
            'methods' => 'GET',
            'callback' => [$this, 'get_events'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
    }

    public function check_permission(): bool {
        return current_user_can('manage_options');
    }

    public function get_logs(\WP_REST_Request $request) {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_login_logs';

        $page = max(1, (int) $request->get_param('page') ?: 1);
        $per_page = max(1, (int) $request->get_param('per_page') ?: 10);
        $status = $request->get_param('status'); 
        $offset = ($page - 1) * $per_page;

        $where  = '';
        $params = [];

        if ($status && $status !== 'all') {
            $where = 'WHERE status_login = %s';
            $params[] = ucfirst($status);
        }

        $total = $params
            ? (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} {$where}", $params))
            : (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");

        $rows_sql    = "SELECT username, ip, status_login, user_agent, attempted_at
                         FROM {$table} {$where}
                         ORDER BY attempted_at DESC
                         LIMIT %d OFFSET %d";
        $rows_params = array_merge($params, [$per_page, $offset]);

        $results = $wpdb->get_results($wpdb->prepare($rows_sql, $rows_params), ARRAY_A);

        $rows = array_map(function ($row) {
            return [
                'user'      => $row['username'],
                'ip'        => $row['ip'],
                'status'    => $row['status_login'],
                'userAgent' => $row['user_agent'],
                'timestamp' => human_time_diff(strtotime($row['attempted_at']), current_time('timestamp')),
            ];
        }, $results);

        return rest_ensure_response([
            'rows'     => $rows,
            'total'    => $total,
            'page'     => $page,
            'per_page' => $per_page,
        ]);
    }

    public function get_stats(\WP_REST_Request $request) {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_login_logs';

        $total   = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
        $failed  = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE status_login = 'Failed'");
        $success  = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE status_login = 'Success'");
        $blocked = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE status_login = 'Blocked'");

        $recent_total = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$table} WHERE attempted_at >= %s",
            gmdate('Y-m-d H:i:s', strtotime('-1 hour'))
        ));

        // Failed attempts in the last hour, for security status
        $recent_failed = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$table} WHERE status_login = 'Failed' AND attempted_at >= %s",
            gmdate('Y-m-d H:i:s', strtotime('-1 hour'))
        ));

        if ($recent_failed >= 15) {
            $security_status = 'Under Attack';
        } elseif ($recent_failed >= 5) {
            $security_status = 'Vigilant';
        } else {
            $security_status = 'Secure';
        }

        if ($recent_total === 0) {
            $security_score = 100;
        } else {
            $failure_rate = $recent_failed / $recent_total; 
            $security_score = 92 - ($failure_rate * 72);
            $security_score = max(20, (int) round($security_score));
        }

        return rest_ensure_response([
            'total_logins'     => $total,
            'failed_attempts'  => $failed,
            'success_attempts'  => $success,
            'threats_blocked'  => $blocked,
            'security_status'  => $security_status,
            'security_score'   => $security_score,
            'recent_failed'    => $recent_failed,
        ]);
    }

    public function get_daily(\WP_REST_Request $request) {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_login_logs';

        $days = (int) $request->get_param('days') ?: 7;
        $days = max(1, min($days, 90));

        if ($days === 1) {
            return rest_ensure_response($this->get_selected_hours($table));
        }

        return rest_ensure_response($this->get_selected_days($table, $days));
    }

    private function get_selected_hours(string $table): array {
        global $wpdb;

        $start = gmdate('Y-m-d H:i:s', strtotime('-24 hours'));

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT attempted_at, status_login FROM {$table} WHERE attempted_at >= %s",
                $start
            ),
            ARRAY_A
        );

        $buckets = [];
        foreach ([0, 4, 8, 12, 16, 20] as $hour) {
            $buckets[$hour] = ['success' => 0, 'failed' => 0];
        }

        $now = current_time('timestamp');
        $cutoff = $now - DAY_IN_SECONDS;

        foreach ($rows as $row) {
            $timestamp = strtotime($row['attempted_at']);
            if ($timestamp < $cutoff) {
                continue;
            }

            $hour = (int) gmdate('G', $timestamp);
            $bucket_start = intdiv($hour, 4) * 4; // rounds down to nearest 0/4/8/12/16/20

            if ($row['status_login'] === 'Success') {
                $buckets[$bucket_start]['success']++;
            } elseif ($row['status_login'] === 'Failed') {
                $buckets[$bucket_start]['failed']++;
            }
        }

        $result = [];
        foreach ($buckets as $hour => $counts) {
            $label_start = $this->format_hour($hour);
            $label_end   = $this->format_hour(($hour + 4) % 24);

            $result[] = [
                'day'      => "{$label_start}-{$label_end}",
                'date'     => sprintf('%02d:00', $hour),
                'success'  => $counts['success'],
                'failed'   => $counts['failed'],
                'attempts' => $counts['success'] + $counts['failed'],
            ];
        }

        return $result;
    }

    private function format_hour(int $hour): string {
        return gmdate('g A', strtotime("{$hour}:00"));
    }

    
    private function get_selected_days(string $table, int $days): array {
        global $wpdb;

        $start_date = gmdate('Y-m-d', strtotime("-" . ($days - 1) . " days"));

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT
                    DATE(attempted_at) AS log_date,
                    SUM(CASE WHEN status_login = 'Success' THEN 1 ELSE 0 END) AS success,
                    SUM(CASE WHEN status_login = 'Failed' THEN 1 ELSE 0 END) AS failed
                FROM {$table}
                WHERE attempted_at >= %s
                GROUP BY DATE(attempted_at)
                ORDER BY log_date ASC",
                $start_date
            ),
            ARRAY_A
        );

        $by_date = [];
        foreach ($rows as $row) {
            $by_date[$row['log_date']] = [
                'success' => (int) $row['success'],
                'failed'  => (int) $row['failed'],
            ];
        }

        $use_short_labels = $days > 14;

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = gmdate('Y-m-d', strtotime("-{$i} days"));
            $counts = $by_date[$date] ?? ['success' => 0, 'failed' => 0];

            $result[] = [
                'day'      => $use_short_labels
                    ? gmdate('M j', strtotime($date))
                    : gmdate('l', strtotime($date)),
                'date'     => $date,
                'success'  => $counts['success'],
                'failed'   => $counts['failed'],
                'attempts' => $counts['success'] + $counts['failed'],
            ];
        }

        return $result;
    }

    public function get_events(): \WP_REST_Response {
        $logger = new Logger();
        return new \WP_REST_Response($logger->events(), 200);
    }
}