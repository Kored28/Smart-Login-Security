<?php

namespace SmartLoginSecurity\Security;

use SmartLoginSecurity\Settings\Settings;

if (! defined('ABSPATH')) {
    die;
}

class BruteForceDetector {

    private const WINDOW_SECONDS = 30;

    private EventLogger $event_logger;
    private IpBlocker $ip_blocker;

    public function __construct(EventLogger $event_logger, IpBlocker $ip_blocker) {
        $this->event_logger = $event_logger;
        $this->ip_blocker = $ip_blocker;
    }

    public function check(string $ip): void {
        $settings = Settings::get();

        // Respect the Brute Force Protection toggle
        if (! $settings['brute_force_enabled']) {
            return;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'smart_login_logs';

        $window_start = gmdate('Y-m-d H:i:s', strtotime('-' . self::WINDOW_SECONDS . ' seconds'));

        $attempts = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$table}
             WHERE ip = %s AND status_login = 'Failed' AND attempted_at >= %s",
            $ip,
            $window_start
        ));

        $block_threshold   = (int) $settings['login_attempt_limit'];
        $warning_threshold = max(1, intdiv($block_threshold, 2));

        if ($attempts >= $block_threshold) {
            $this->handle_block($ip, $attempts, $settings);
        } elseif ($attempts >= $warning_threshold) {
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

    private function handle_block(string $ip, int $attempts, array $settings): void {
        $duration_seconds = (int) $settings['lockout_duration_minutes'] * MINUTE_IN_SECONDS;

        $this->ip_blocker->block(
            $ip,
            sprintf('Brute force: %d failed attempts in %d seconds', $attempts, self::WINDOW_SECONDS),
            'system',
            $duration_seconds
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