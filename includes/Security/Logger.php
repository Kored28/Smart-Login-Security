<?php 

namespace SmartLoginSecurity\Security;

if(! defined('ABSPATH') ){
    die;
}

class Logger {
    private const RISK_MEDIUM_THRESHOLD = 3;
    private const RISK_HIGH_THRESHOLD = 5;
    private const TIME_MINUTES_WINDOW = 60;


    public function get_logs(): array{
        global $wpdb;

        $table = $wpdb->prefix . 'smart_login_logs';
        $query = "SELECT * FROM {$table}";
        $results = $wpdb->get_results($query);


        return is_array($results) ? $results : [];
    }

    public function events() {
        global $wpdb;

        $table = $wpdb->prefix . 'smart_login_logs';
        $time_limit = self::TIME_MINUTES_WINDOW;

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ip, COOUNT(*) AS attempts
                FROM {$table}
                WHERE status_login = %$
                    AND attempted_at >= NOW() - INTERVAL %d MINUTE
                GROUP BY ip
                ORDER BY attempts DESC",
                'Failed',
                $time_limit
            )
        );

        if(empty($results)){
            return [];
        }

        $events = [];

        foreach ($results as $row){
            $attempts = (int) $row->attempts;
            $ip = $row->ip;

            [$risk, $description] = $this->clarify_risk($attempts, $ip);

            $events[] = [
                'ip' => $ip,
                'attempts' => $attempts,
                'risk' => $risk,
                'description' => $description
            ];

            return $events;
        }
    }

    private function clarify_risk(int $attempts, string $ip): array{
        if($attempts >= self::RISK_HIGH_THRESHOLD){
            $risk = 'High';
            $description = sprintf('High risk: IP %s has made %d failed login attempts in the last hour. Possible brute-force attack.', $ip, $attempts);
        }elseif($attempts >= self::RISK_MEDIUM_THRESHOLD){
            $risk = 'Medium';
            $description = sprintf('Medium risk: IP %s has made %d failed login attempts in the last hour. Monitor closely.', $ip, $attempts);
        } else {
            $risk = 'Low';
            $description = sprintf('Low risk: IP %s has made %d failed login attempt(s) in the last hour.', $ip, $attempts);
        }

        return [$risk, $description];

    }
}