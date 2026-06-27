<?php

namespace SmartLoginSecurity\Core;

if(! defined('ABSPATH') ){
    die;
}

class Activator {
    public static function activate() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'smart_login_logs';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name(
            id BIGINT UNSIGNED AUTO_INCREMENT,
            username VARCHAR(255),
            ip VARCHAR(45),
            status_login VARCHAR(20),
            user_agent TEXT,
            attempted_at DATETIME,
            PRIMARY KEY (id)
        )$charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta($sql);
    }
}