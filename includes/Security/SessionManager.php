<?php

namespace SmartLoginSecurity\Security;

use SmartLoginSecurity\Settings\Settings;

if (! defined('ABSPATH')) {
    die;
}

class SessionManager {

    public function init(): void {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_idle_timeout_script']);
    }

    public function enqueue_idle_timeout_script(): void {
        if (! is_user_logged_in()) {
            return;
        }

        $settings = Settings::get();

        // Respect the Session Management toggle
        if (! $settings['session_management_enabled']) {
            return;
        }

        $timeout_minutes = (int) $settings['session_idle_timeout_minutes'];

        $assets_url = plugin_dir_url(dirname(dirname(__FILE__))) . 'app/dist/';

        wp_enqueue_script(
            'smart-login-security-idle-timeout',
            $assets_url . 'idle-timeout.js',
            [],
            false,
            true
        );

        wp_localize_script('smart-login-security-idle-timeout', 'smartLoginSecuritySession', [
            'timeoutMinutes' => $timeout_minutes,
            'logoutUrl'      => wp_logout_url(admin_url()),
        ]);
    }
}