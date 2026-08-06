<?php

namespace SmartLoginSecurity\Security;

if (! defined('ABSPATH')) {
    die;
}

class BruteForceDetector {

    private const WARNING_THRESHOLD = 5;
    private const BLOCK_THRESHOLD = 15;
    private const WINDOW_SECONDS = 30;

    private EventLogger $event_logger;
    private IpBlocker $ip_blocker;

    public function __construct(EventLogger $event_logger, IpBlocker $ip_blocker) {
        $this->event_logger = $event_logger;
        $this->ip_blocker = $ip_blocker;
    }

    public function check(string $ip): void {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_login_logs';

        $window_start = gmdate('Y-m-d H:i:s', strtotime('-' . self::WINDOW_SECONDS . ' seconds'));

        $attempts = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$table}
             WHERE ip = %s AND status_login = 'Failed' AND attempted_at >= %s",
            $ip,
            $window_start
        ));

        if ($attempts >= self::BLOCK_THRESHOLD) {
            $this->handle_block($ip, $attempts);
        } elseif ($attempts >= self::WARNING_THRESHOLD) {
            $this->handle_warning($ip, $attempts);
        }
    }

    private function handle_warning(string $ip, int $attempts): void {
        if ($this->already_flagged_recently($ip, 'Unusual Login Activity')) {
            return;
        }

        $this->event_logger->log(
            'Warning',
            'Unusual Login Activity',
            sprintf('IP %s has made %d failed login attempts in %d seconds.', $ip, $attempts, self::WINDOW_SECONDS),
            $ip,
            'ip'
        );
    }

    private function handle_block(string $ip, int $attempts): void {
        $this->ip_blocker->block(
            $ip,
            sprintf('Brute force: %d failed attempts in %d seconds', $attempts, self::WINDOW_SECONDS),
            'system',
            HOUR_IN_SECONDS
        );

        if ($this->already_flagged_recently($ip, 'IP Blocked: Brute Force Attack')) {
            return;
        }

        $this->event_logger->log(
            'Critical',
            'IP Blocked: Brute Force Attack',
            sprintf('Detected %d failed attempts in %d seconds.', $attempts, self::WINDOW_SECONDS),
            $ip,
            'ip'
        );
    }

    private function already_flagged_recently(string $ip, string $title): bool {
        global $wpdb;
        $table = $wpdb->prefix . 'smart_security_events';

        $recent = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table}
             WHERE actor = %s AND title = %s
             AND created_at >= %s
             LIMIT 1",
            $ip,
            $title,
            gmdate('Y-m-d H:i:s', strtotime('-' . self::WINDOW_SECONDS . ' seconds'))
        ));

        return (bool) $recent;
    }
}