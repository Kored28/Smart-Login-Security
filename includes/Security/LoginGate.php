<?php

namespace SmartLoginSecurity\Security;

if (! defined('ABSPATH')) {
    die;
}

class LoginGate {

    private IpBlocker $ip_blocker;

    public function __construct(IpBlocker $ip_blocker) {
        $this->ip_blocker = $ip_blocker;
    }

    public function init(): void {
        add_filter('authenticate', [$this, 'reject_blocked_ip'], 20, 1);
    }

    public function reject_blocked_ip($user) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        if ($ip && $this->ip_blocker->is_blocked($ip)) {
            return new \WP_Error(
                'ip_blocked',
                __('Too many failed login attempts. Please try again later.', 'smart-login-security')
            );
        }

        return $user;
    }
}