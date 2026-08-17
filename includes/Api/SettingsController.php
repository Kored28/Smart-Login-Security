<?php

namespace SmartLoginSecurity\Api;

use SmartLoginSecurity\Settings\Settings;

if (! defined('ABSPATH')) {
    die;
}

class SettingsController {
    public function init(): void {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void {
        register_rest_route('smart-login-security/v1', '/settings', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_settings'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        register_rest_route('smart-login-security/v1', '/settings', [
            'methods'             => 'POST',
            'callback'            => [$this, 'update_settings'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
    }

    public function check_permission(): bool {
        return current_user_can('manage_options');
    }

    public function get_settings(): \WP_REST_Response {
        return rest_ensure_response(Settings::get());
    }

    public function update_settings(\WP_REST_Request $request): \WP_REST_Response {
        $body = $request->get_json_params();

        if (! is_array($body)) {
            return rest_ensure_response(new \WP_Error('invalid_body', 'Expected a JSON object', ['status' => 400]));
        }

        $updated = Settings::update($body);
        return rest_ensure_response($updated);
    }
}