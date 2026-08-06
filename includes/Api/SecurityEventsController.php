<?php

namespace SmartLoginSecurity\Api;

use SmartLoginSecurity\Security\EventLogger;

if (! defined('ABSPATH')) {
    die;
}

class SecurityEventsController {
    public function init(): void {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void {
        register_rest_route('smart-login-security/v1', '/security-events', [
            'methods' => 'GET',
            'callback' => [$this, 'get_events'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
    }

    public function check_permission(): bool {
        return current_user_can('manage_options');
    }

    public function get_events(\WP_REST_Request $request) {
        $page = max(1, (int) $request->get_param('page') ?: 1);
        $per_page = max(1, (int) $request->get_param('per_page') ?: 4);
        $severity = $request->get_param('severity');

        $logger = new EventLogger();
        $data = $logger->get_events($page, $per_page, $severity);

        return rest_ensure_response($data);
    }
}