<?php 

/** 
 * Plugin Name: Smart Login Security
 * Plugin URI: http://example.com/plugin-name-uri/
 * Description: Protects WordPress websites from brute-force login attacks.
 * Version: 1.0.0
 * Author: Onose Ogbidi
 * Author URI: http://example.com/
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: smart-security
 * Domain Path: /languages
 */


if(! defined('ABSPATH') ){
    die;
}


if( file_exists(__DIR__ . '/vendor/autoload.php')){
    require_once __DIR__ . '/vendor/autoload.php';
}

// Activate and Deactivate
use SmartLoginSecurity\Core\Activator;
use SmartLoginSecurity\Core\Deactivator;

register_activation_hook(__FILE__, [Activator::class, 'activate']);
register_deactivation_hook(__FILE__, [Deactivator::class, 'deactivate']);

// Load plugin
use SmartLoginSecurity\Core\Plugin;

$plugin = new Plugin();
$plugin->init();