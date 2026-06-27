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
        $user_agent = $this->get_user_agent();

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

        return $attempts;
    }

    public function track_success_login(string $username): void {
        $status = 'Success';
        $ip = $this->get_client_ip();
        $user_agent = $this->get_user_agent();

        $track_success= [
            'ip' => $ip,
            'username' => $username,
            'status' => $status,
            'user_agent' => $user_agent,
            'time' => current_time('mysql'),
        ];

        // Cache recent login activites for short term
        $transient_key = self::SUCCESS_TRANSIENT_PREFIX . md5($username);
        set_transient($transient_key, $track_success, self::TRANSIENT_EXPIRY);

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

    private function get_client_ip() {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
    }

    private function get_user_agent() {
        $device = $_SERVER['HTTP_USER_AGENT'] ?? '';

        return $device;
    }
}

