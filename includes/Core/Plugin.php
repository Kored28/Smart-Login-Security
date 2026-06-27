<?php 

namespace SmartLoginSecurity\Core;

use SmartLoginSecurity\Admin\AdminController;

if(! defined('ABSPATH') ){
    die;
}

class Plugin {
    public function init() {
        add_action('admin_notices', [$this, 'testing']);

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