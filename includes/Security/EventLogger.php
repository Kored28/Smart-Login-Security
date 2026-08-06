<?php

namespace SmartLoginSecurity\Security;

if (! defined('ABSPATH')) {
    die;
}

class EventLogger {

    public function log(string $severity, string $title, string $description, string $actor, string $actor_type): void {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_security_events';

        $wpdb->insert($table, [
            'severity'    => $severity,
            'title'       => $title,
            'description' => $description,
            'actor'       => $actor,
            'actor_type'  => $actor_type,
            'created_at'  => current_time('mysql', true),
        ]);
    }

    public function get_events(int $page = 1, int $per_page = 4, ?string $severity = null): array {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_security_events';
        $offset = ($page - 1) * $per_page;

        $where  = '';
        $params = [];

        if ($severity && $severity !== 'all') {
            $where    = 'WHERE severity = %s';
            $params[] = ucfirst($severity);
        }

        $total = $params
            ? (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} {$where}", $params))
            : (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");

        $sql    = "SELECT severity, title, description, actor, actor_type, created_at
                    FROM {$table} {$where}
                    ORDER BY created_at DESC
                    LIMIT %d OFFSET %d";
        $params = array_merge($params, [$per_page, $offset]);

        $results = $wpdb->get_results($wpdb->prepare($sql, $params), ARRAY_A);

        $rows = array_map(function ($row) {
            return [
                'severity'    => $row['severity'],
                'title'       => $row['title'],
                'description' => $row['description'],
                'actor'       => $row['actor'],
                'actorType'   => $row['actor_type'],
                'timestamp'   => date('M j, Y · H:i:s', strtotime($row['created_at'])),
            ];
        }, $results ?: []);

        return ['rows' => $rows, 'total' => $total];
    }
}