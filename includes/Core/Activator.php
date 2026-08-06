<?php

namespace SmartLoginSecurity\Core;

if(! defined('ABSPATH') ){
    die;
}

class Activator {
    public function activate() {
        self::create_login_logs_table();
        self::create_security_events_table();
        self::create_blocked_ips_table();
    }

    public static function create_login_logs_table() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'smart_login_logs';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id BIGINT UNSIGNED AUTO_INCREMENT,
            username VARCHAR(255),
            ip VARCHAR(45) NOT NULL,
            status_login VARCHAR(20),
            user_agent TEXT NOT NULL,
            attempted_at DATETIME NOT NULL,
            PRIMARY KEY  (id)
        ){$charset_collate};";


        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta($sql);
    }

    public static function create_security_events_table(): void {
        global $wpdb;

        $table_name      = $wpdb->prefix . 'smart_security_events';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            severity ENUM('Critical', 'Warning', 'Info') NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            actor VARCHAR(255) NOT NULL,
            actor_type ENUM('system', 'ip', 'user') NOT NULL,
            created_at DATETIME NOT NULL,
            INDEX idx_severity (severity),
            INDEX idx_created_at (created_at)
        ) {$charset_collate};";
        

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta($sql);
    }

    public static function create_blocked_ips_table(): void {
        global $wpdb;

        $table_name      = $wpdb->prefix . 'smart_blocked_ips';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            ip VARCHAR(45) NOT NULL,
            reason VARCHAR(255) NOT NULL,
            blocked_by ENUM('system', 'admin') NOT NULL,
            blocked_at DATETIME NOT NULL,
            expires_at DATETIME NULL,
            UNIQUE KEY ip_unique (ip)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}