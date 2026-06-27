<?php

namespace SmartLoginSecurity\Admin;

if(! defined('ABSPATH') ){
    die;
}

class AdminController {
    public function init(): void {
        // Admin menu for smart login security
        add_action('admin_menu', [$this, 'register_menus']);

        // Loads reacts on the backend
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function register_menus(): void {
        add_menu_page(
            'Smart Login Security',
            'Smart Security',
            'manage_options',
            'smart-login-security',
            [$this, 'render_dashboard'],
            'dashicons-shield',
            80
        );

        add_submenu_page('smart-login-security', 'Dashboard', 'Dashboard', 'manage_options', 'smart-login-security', [$this, 'render_dashboard']);
        add_submenu_page('smart-login-security', 'Login Activity', 'Login Activity', 'manage_options', 'smart-login-security-activity', [$this, 'render_dashboard']);
        add_submenu_page('smart-login-security', 'Security Logs', 'Security Logs', 'manage_options', 'smart-login-security-logs', [$this, 'render_dashboard']);
        add_submenu_page('smart-login-security', 'Settings', 'Settings', 'manage_options', 'smart-login-security-settings', [$this, 'render_dashboard']);
    }

    public function render_dashboard() {
        echo '<div id="smart-login-root"></div>';
    }

    public function enqueue_assets(string $hook) {
        if(strpos($hook, 'smart-login-security') === false){
            return;
        }

        $dist = plugin_dir_url(dirname(dirname(__FILE__))) . 'app/dist/';

        // React js build
        wp_enqueue_script(
            'smart-login-security-app',
            $dist . 'bundle.js',
            [],
            false,
            true
        );

        // Styles for React build
        wp_enqueue_style(
            'smart-login-security-styles',
            $dist . 'bundle.css',
            [],
            false
        );

        // Pass PHP data to react
        wp_localize_script('smart-login-security-app', 'smartLoginSecurity', [
            'apiUrl' => rest_url('smart-login-security/v1'),
            'nonce' => wp_create_nonce('wp_rest')
        ]);

        // Add Es module to the tag
        add_filter('script_loader_tag', function ($tag, $handle, $src) {
            if ($handle === 'smart-login-security-app'){
                return str_replace('<script ', '<script type="module" ', $tag);
            }

            return $tag;
        }, 10, 3);
    }
}