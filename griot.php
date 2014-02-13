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

/**
 * Main Griot class.
 */
include( 'class-griot.php' );

// Instantiate Griot class and register templates.
// NOTE: Template array key must match post type.
$templates = array(
	'object'  =>   plugins_url( 'templates/object.html', __FILE__ ),
	'story'   =>   plugins_url( 'templates/story.html', __FILE__ ),
);

$Griot = new Griot( $templates );