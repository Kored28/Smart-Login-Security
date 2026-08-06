<?php

namespace SmartLoginSecurity\Api;

use SmartLoginSecurity\Security\IpBlocker;
use SmartLoginSecurity\Security\EventLogger;

if (! defined('ABSPATH')) {
    die;
}

class BlockedIpsController {
    public function init(): void {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void {
        register_rest_route('smart-login-security/v1', '/blocked-ips', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_blocked'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        register_rest_route('smart-login-security/v1', '/blocked-ips', [
            'methods'             => 'POST',
            'callback'            => [$this, 'block_ip'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        register_rest_route('smart-login-security/v1', '/blocked-ips/(?P<ip>[\d\.]+)', [
            'methods'             => 'DELETE',
            'callback'            => [$this, 'unblock_ip'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
    }

    public function check_permission(): bool {
        return current_user_can('manage_options');
    }

    public function get_blocked(): \WP_REST_Response {
        $blocker = new IpBlocker();
        return rest_ensure_response($blocker->list_blocked());
    }

    public function block_ip(\WP_REST_Request $request): \WP_REST_Response {
        $ip     = sanitize_text_field($request->get_param('ip'));
        $reason = sanitize_text_field($request->get_param('reason') ?: 'Manually blocked by admin');

        if (! filter_var($ip, FILTER_VALIDATE_IP)) {
            return rest_ensure_response(new \WP_Error('invalid_ip', 'Invalid IP address', ['status' => 400]));
        }

        $blocker = new IpBlocker();
        $blocker->block($ip, $reason, 'admin', null); // null = permanent, admin's call

        (new EventLogger())->log(
            'Info',
            'IP Manually Blocked',
            sprintf('%s was manually blocked by an administrator. Reason: %s', $ip, $reason),
            $ip,
            'ip'
        );

        return rest_ensure_response(['success' => true]);
    }

    public function unblock_ip(\WP_REST_Request $request): \WP_REST_Response {
        $ip = sanitize_text_field($request->get_param('ip'));

        $blocker = new IpBlocker();
        $blocker->unblock($ip);

        return rest_ensure_response(['success' => true]);
    }
}