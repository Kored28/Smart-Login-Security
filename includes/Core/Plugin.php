<?php 

namespace SmartLoginSecurity\Core;

use SmartLoginSecurity\Admin\AdminController;
use SmartLoginSecurity\Api\LogsController;
use SmartLoginSecurity\Security\LoginTracker;

if(! defined('ABSPATH') ){
    die;
}

class Plugin {
    public function init() {
        //add_action('admin_notices', [$this, 'testing']);

        // REST API
        $log_controller = new LogsController();
        $log_controller->init();

        // Security Class
        $login_tracker = new LoginTracker();
        $login_tracker->init();

        if(is_admin()){
            $admin = new AdminController();
            $admin->init();
        }
    }

    public function testing() {
        ?>
        <div class="notice notice-success">
            <p><?php esc_html_e('Plugin is running', 'smart-login-security'); ?></p>
        </div>
        <?php
    }
}