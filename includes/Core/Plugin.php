<?php 

namespace SmartLoginSecurity\Core;

use SmartLoginSecurity\Admin\AdminController;
use SmartLoginSecurity\Api\BlockedIpsController;
use SmartLoginSecurity\Api\LogsController;
use SmartLoginSecurity\Api\SecurityEventsController;
use SmartLoginSecurity\Security\IpBlocker;
use SmartLoginSecurity\Security\LoginGate;
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

        $security_events_controller = new SecurityEventsController();
        $security_events_controller->init();

        $blocked_ips_controller = new BlockedIpsController();
        $blocked_ips_controller->init();
        

        // Security Class
        $login_tracker = new LoginTracker();
        $login_tracker->init();

        $login_gate = new LoginGate(new IpBlocker());
        $login_gate->init();

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