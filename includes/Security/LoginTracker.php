<?php

namespace SmartLoginSecurity\Security;

if(! defined('ABSPATH') ){
    die;
}

class LoginTracker {
    private const FAILED_TRANSIENT_PREFIX = 'failed_login_';
    private const SUCCESS_TRANSIENT_PREFIX = 'success_login_';
    private const TRANSIENT_EXPIRY = HOUR_IN_SECONDS * 24;

    public function init(){
        // Tracking Failed Login Attempt
        add_action('wp_login_failed', [$this, 'track_failed_login']);

        // Tracking successful Login Attempt
        add_action('wp_login', [$this, 'track_success_login'], 10);

    }

    public function track_failed_login(string $username): array {
        $status = 'Failed';
        $ip = $this->get_client_ip();
        $attempts = $this->get_failed_attempts($username);
        $user_agent = $this->parse_user_agent($this->get_user_agent());

        $attempts[] = [
            'ip' => $ip,
            'username' => $username,
            'status' => $status,
            'user_agent' => $user_agent,
            'time' => current_time('mysql'),
        ];

        // Cache recent login activites
        $transient_key = self::FAILED_TRANSIENT_PREFIX . md5($username);
        set_transient($transient_key, $attempts, self::TRANSIENT_EXPIRY);

        // As logs in the Database
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'smart_login_logs',
            [
                'username' => $username,
                'ip' => $ip,
                'status_login' => $status,
                'user_agent' => $user_agent,
                'attempted_at' => current_time('mysql')
            ],['%s', '%s', '%s', '%s', '%s']
        );

        // Checks if the Ip has a warning or has been blocked
        $detector = new BruteForceDetector(new EventLogger(), new IpBlocker());
        $detector->check($ip);

        return $attempts;
    }

    public function track_success_login(string $username): void {
        $status = 'Success';
        $ip = $this->get_client_ip();
        $user_agent = $this->parse_user_agent($this->get_user_agent());
        $attempts = $this->get_failed_attempts($username);

        $attempts = [
            'ip' => $ip,
            'username' => $username,
            'status' => $status,
            'user_agent' => $user_agent,
            'time' => current_time('mysql'),
        ];

        // Cache recent login activites for short term
        $transient_key = self::SUCCESS_TRANSIENT_PREFIX . md5($username);
        set_transient($transient_key, $attempts, self::TRANSIENT_EXPIRY);

        // As logs in the Database
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'smart_login_logs',
            [
                'username' => $username,
                'ip' => $ip,
                'status_login' => $status,
                'user_agent' => $user_agent,
                'attempted_at' => current_time('mysql')
            ],['%s', '%s', '%s', '%s', '%s']
        );
    }

    public function get_failed_attempts(string $username): array {
        $transient_key = self::FAILED_TRANSIENT_PREFIX . md5($username);
        $attempts = get_transient($transient_key);
        return is_array($attempts) ? $attempts : [];
    }

    public function get_success_attempts(string $username): array {
        $transient_key = self::SUCCESS_TRANSIENT_PREFIX . md5($username);
        $attempts = get_transient($transient_key);
        return is_array($attempts) ? $attempts : [];
    }

    private function get_client_ip() {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
    }

    private function get_user_agent() {
        $device = $_SERVER['HTTP_USER_AGENT'] ?? '';

        return $device;
    }

    private function parse_user_agent(string $user_agent): string {
        if ($user_agent === '') {
            return 'Unknown';
        }

        // Browser
        if (preg_match('/Edg\/([\d.]+)/', $user_agent)) {
            $browser = 'Edge';
        } elseif (preg_match('/OPR\/([\d.]+)/', $user_agent)) {
            $browser = 'Opera';
        } elseif (preg_match('/Chrome\/([\d.]+)/', $user_agent) && !str_contains($user_agent, 'Edg')) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox\/([\d.]+)/', $user_agent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Version\/([\d.]+).*Safari/', $user_agent)) {
            $browser = 'Safari';
        } else {
            $browser = 'Unknown Browser';
        }

        // OS
        if (str_contains($user_agent, 'Windows')) {
            $os = 'Windows';
        } elseif (str_contains($user_agent, 'Mac OS X')) {
            $os = 'macOS';
        } elseif (str_contains($user_agent, 'Android')) {
            $os = 'Android';
        } elseif (str_contains($user_agent, 'iPhone') || str_contains($user_agent, 'iPad')) {
            $os = 'iOS';
        } elseif (str_contains($user_agent, 'Linux')) {
            $os = 'Linux';
        } else {
            $os = 'Unknown OS';
        }

        return "{$browser} on {$os}";
    }
}

