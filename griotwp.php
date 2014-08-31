<?php

/**
 * Plugin Name: GriotWP
 * Description: Provides a simple and extensible back end for the Minneapolis Institute of Arts' open-source iPad presentation software, Griot.
 * Version: 0.0.1
 * Author: Minneapolis Institute of Arts
 * Text Domain: griot
 * Author URI: http://new.artsmia.org
 * License: MIT
 */

// Main Griot class.
include( 'class-griotwp.php' );

// Instantiate Griot class and register templates.
// NOTE: Template array key must match post type.
$templates = array(
	'object'  =>   plugins_url( 'templates/object.html', __FILE__ ),
	'story'   =>   plugins_url( 'templates/story.html', __FILE__ ),
	'panel'   =>   plugins_url( 'templates/panel.html', __FILE__ ),
);
new GriotWP( $templates );

// Activation: Update rewrite rules and build list of records.
register_activation_hook( __FILE__, array( 'GriotWP', 'flush_rewrite_rules' ) );
register_activation_hook( __FILE__, array( 'GriotWP', 'build_record_list' ) );

// Activation: Create table to track media status.
register_activation_hook( __FILE__, array( 'GriotWP', 'register_media_status_table' ) );

// Deactivation: Update rewrite rules.
register_deactivation_hook( __FILE__, array( 'GriotWP', 'flush_rewrite_rules' ) );