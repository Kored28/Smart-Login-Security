<?php

namespace SmartLoginSecurity\Security;

if (! defined('ABSPATH')) {
    die;
}

class IpBlocker {

    public function block(string $ip, string $reason, string $blocked_by, ?int $duration_seconds = null): void {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_blocked_ips';

        $expires_at = $duration_seconds
            ? gmdate('Y-m-d H:i:s', time() + $duration_seconds)
            : null;

        $wpdb->query($wpdb->prepare(
            "INSERT INTO {$table} (ip, reason, blocked_by, blocked_at, expires_at)
             VALUES (%s, %s, %s, %s, %s)
             ON DUPLICATE KEY UPDATE
                reason = VALUES(reason),
                blocked_by = VALUES(blocked_by),
                blocked_at = VALUES(blocked_at),
                expires_at = VALUES(expires_at)",
            $ip,
            $reason,
            $blocked_by,
            current_time('mysql', true),
            $expires_at
        ));
    }

    public function is_blocked(string $ip): bool {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_blocked_ips';

        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT expires_at FROM {$table} WHERE ip = %s",
            $ip
        ));

        if (! $row) {
            return false;
        }

        // Permanent block
        if ($row->expires_at === null) {
            return true;
        }

        // Timed block
        if (strtotime($row->expires_at) <= time()) {
            $this->unblock($ip);
            return false;
        }

        return true;
    }

    public function unblock(string $ip): void {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_blocked_ips';
        $wpdb->delete($table, ['ip' => $ip], ['%s']);
    }

    public function list_blocked(): array {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_blocked_ips';

        $rows = $wpdb->get_results(
            "SELECT ip, reason, blocked_by, blocked_at, expires_at FROM {$table} ORDER BY blocked_at DESC",
            ARRAY_A
        );

        return array_map(function ($row) {
            return [
                'ip'         => $row['ip'],
                'reason'     => $row['reason'],
                'blockedBy'  => $row['blocked_by'],
                'blockedAt'  => $row['blocked_at'],
                'permanent'  => $row['expires_at'] === null,
                'expiresAt'  => $row['expires_at'],
            ];
        }, $rows ?: []);
    }
}