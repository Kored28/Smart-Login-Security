<?php

namespace SmartLoginSecurity\Settings;

if(! defined('ABSPATH')){
    die;
}

class Settings {

    private const OPTION_KEY = 'smart_login_security_settings';

    public static function defaults(): array {
        return [
            'brute_force_enabled'        => true,
            'login_attempt_limit'        => 5,
            'lockout_duration_minutes'   => 30,
            'notify_on_block'            => true,
            'notify_on_failed_login'     => false,
            'require_2fa_admins'         => false,
            'session_management_enabled'   => false,
            'session_idle_timeout_minutes' => 30,
        ];
    }

    public static function get(): array {
        $stored = get_option(self::OPTION_KEY, []);
        $merged = array_merge(self::defaults(), is_array($stored) ? $stored : []);

        // ensure the key always exists, even if never saved yet
        if (! isset($merged['last_saved_at'])) {
            $merged['last_saved_at'] = null;
        }

        return $merged;
    }

    public static function update(array $incoming): array {
        $current = self::get();
        $sanitized = self::sanitize($incoming, $current);
        $sanitized['last_saved_at'] = current_time('mysql', true);
        update_option(self::OPTION_KEY, $sanitized);
        return $sanitized;
    }

    private static function sanitize(array $incoming, array $current): array {
        return [
            'brute_force_enabled' => isset($incoming['brute_force_enabled'])
                ? (bool) $incoming['brute_force_enabled']
                : $current['brute_force_enabled'],

            'login_attempt_limit' => isset($incoming['login_attempt_limit'])
                ? max(1, min(50, (int) $incoming['login_attempt_limit']))
                : $current['login_attempt_limit'],

            'lockout_duration_minutes' => isset($incoming['lockout_duration_minutes'])
                ? max(5, min(120, (int) $incoming['lockout_duration_minutes']))
                : $current['lockout_duration_minutes'],

            'notify_on_block' => isset($incoming['notify_on_block'])
                ? (bool) $incoming['notify_on_block']
                : $current['notify_on_block'],

            'notify_on_failed_login' => isset($incoming['notify_on_failed_login'])
                ? (bool) $incoming['notify_on_failed_login']
                : $current['notify_on_failed_login'],

            'require_2fa_admins' => isset($incoming['require_2fa_admins'])
                ? (bool) $incoming['require_2fa_admins']
                : $current['require_2fa_admins'],

            'session_management_enabled' => isset($incoming['session_management_enabled'])
                ? (bool) $incoming['session_management_enabled']
                : $current['session_management_enabled'],

            'session_idle_timeout_minutes' => isset($incoming['session_idle_timeout_minutes'])
                ? max(1, (int) $incoming['session_idle_timeout_minutes'])
                : $current['session_idle_timeout_minutes'],
        ];
    }
}

