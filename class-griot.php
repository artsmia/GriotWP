<?php

/**
 * The main class for the plugin.
 * 
 * Sets up WordPress structures for working with records and exposes data for
 * Angular through wp_localize_script. 
 *
 * @since 0.0.1
 */
class Griot{


	/**
	 * Flush rewrite rules. Called on activation and deactivation.
	 *
	 * @since 0.0.1
	 */
	function flush_rewrite_rules() {
		flush_rewrite_rules();
	}


	/**
	 * Register Object custom post type.
	 *
	 * @since 0.0.1
	 */
	function register_object_cpt() {

		$labels = array(
			'name'                => _x( 'Objects', 'Post Type General Name', 'griot' ),
			'singular_name'       => _x( 'Object', 'Post Type Singular Name', 'griot' ),
			'menu_name'           => _x( 'Objects', 'Post Type Menu Name', 'griot' ),
			'parent_item_colon'   => __( 'Parent Object:', 'griot' ),
			'all_items'           => __( 'All Objects', 'griot' ),
			'view_item'           => __( 'View Object', 'griot' ),
			'add_new_item'        => __( 'Add New Object', 'griot' ),
			'add_new'             => __( 'Add New', 'griot' ),
			'edit_item'           => __( 'Edit Object', 'griot' ),
			'update_item'         => __( 'Update Object', 'griot' ),
			'search_items'        => __( 'Search Objects', 'griot' ),
			'not_found'           => __( 'Not found', 'griot' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'griot' ),
		);

		$rewrite = array(
			'slug'                => _x( 'objects', 'URL Slug', 'griot' ),
			'with_front'          => false,
			'feeds'               => true,
			'pages'               => false,
		);

		$args = array(
			'label'               => __( 'object', 'griot' ),
			'description'         => __( 'Represents a primary record in the application.', 'griot' ),
			'labels'              => $labels,
			'supports'            => array( 'title', ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'menu_icon'						=> 'dashicons-format-image',
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
			'rewrite'             => $rewrite,
		);

		register_post_type( 'object', $args );

	}

	/**
	 * Register Story custom post type.
	 *
	 * @since 0.0.1
	 */
	function register_story_cpt() {

		$labels = array(
			'name'                => _x( 'Stories', 'Post Type General Name', 'griot' ),
			'singular_name'       => _x( 'Story', 'Post Type Singular Name', 'griot' ),
			'menu_name'           => _x( 'Stories', 'Post Type Menu Name', 'griot' ),
			'parent_item_colon'   => __( 'Parent Story:', 'griot' ),
			'all_items'           => __( 'All Stories', 'griot' ),
			'view_item'           => __( 'View Story', 'griot' ),
			'add_new_item'        => __( 'Add New Story', 'griot' ),
			'add_new'             => __( 'Add New', 'griot' ),
			'edit_item'           => __( 'Edit Story', 'griot' ),
			'update_item'         => __( 'Update Story', 'griot' ),
			'search_items'        => __( 'Search Stories', 'griot' ),
			'not_found'           => __( 'Not found', 'griot' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'griot' ),
		);

		$rewrite = array(
			'slug'                => _x( 'stories', 'URL Slug', 'griot' ),
			'with_front'          => false,
			'feeds'               => true,
			'pages'               => false,
		);

		$args = array(
			'label'               => __( 'story', 'griot' ),
			'description'         => __( 'Represents secondary media related to a primary record in the application.', 'griot' ),
			'labels'              => $labels,
			'supports'            => array( 'title', ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'menu_icon'						=> 'dashicons-book',
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
			'rewrite'             => $rewrite,
		);

		register_post_type( 'story', $args );

	}


	/**
	 * Define endpoint for retrieving JSON.
	 *
	 * @since 0.0.1
	 */
	function register_endpoint() {

		add_rewrite_endpoint( 'griot', EP_ROOT );

	}


	/**
	 * Redirect requests to endpoint
	 *
	 * @since 0.0.1
	 */
	function redirect_endpoint() {

		global $wp_query;

		if( ! isset( $wp_query->query_vars['griot'] ) ) {
			return;
		}

		include( 'endpoint.php' );

		exit;

	}


	/**
	 * Build a list of story and object records for use in related record fields.
	 *
	 * @since 0.0.1
	 */
	function build_record_list() {

		global $wpdb;

		$objects_query = "SELECT ID, post_title FROM $wpdb->posts WHERE post_type = 'object' AND post_status = 'publish'";

		$objects = $wpdb->get_results( $objects_query, ARRAY_A );

		$stories_query = "SELECT ID, post_title FROM $wpdb->posts WHERE post_type = 'story' AND post_status = 'publish'";

		$stories = $wpdb->get_results( $stories_query, ARRAY_A );

		$record_list = array(
			'object' => $objects,
			'story' => $stories,
		);

		update_option( 'griot_record_list', $record_list );

	}


	/**
	 * Enqueue vendor and plugin scripts and stylesheets.
	 *
	 * @since 0.0.1
	 */
	function enqueue_scripts_and_styles() { 

		$screen = get_current_screen();

		// Editing screens managed by GriotWP
		$edit_screens = array( 'object', 'story' );
		if( in_array( $screen->id, $edit_screens ) ) {

			// Angular
			wp_enqueue_script( 
				'angular', 
				plugins_url( 'components/angular/angular.min.js', __FILE__ ), 
				false, 
				null,
				true
			);

			// CKEditor
			// Required by WYSIWYG fields
			wp_enqueue_script(
				'ckeditor',
				plugins_url( 'components/ckeditor/ckeditor.js', __FILE__ ),
				false
			);
			wp_enqueue_script(
				'ckeditor_adapter',
				plugins_url( 'components/ckeditor/adapters/jquery.js', __FILE__ ),
				array( 'ckeditor' ),
				null,
				true
			);

			// Swiper
			// Required by repeater fields
			wp_enqueue_style(
				'swiper',
				plugins_url( 'components/swiper/idangerous.swiper.css', __FILE__ ),
				false
			);
			wp_enqueue_script(
				'swiper',
				plugins_url( 'components/swiper/idangerous.swiper.js', __FILE__ ),
				false,
				null,
				true
			);

			// Leaflet
			// Required by annotatedimage fields
			wp_enqueue_style(
				'leaflet',
				plugins_url( 'components/leafletnew/leaflet.css', __FILE__  ),
				false
			);
			wp_enqueue_script(
				'leaflet',
				plugins_url( 'components/leafletnew/leaflet.js', __FILE__  ),
				false,
				null,
				true
			);

			// Leaflet Draw
			// Required by annotatedimage fields
			wp_enqueue_style(
				'leaflet_draw',
				plugins_url( 'components/leaflet.draw/leaflet.draw.css', __FILE__  ),
				false
			);
			wp_enqueue_script(
				'leaflet_draw',
				plugins_url( 'components/leaflet.draw/leaflet.draw.js', __FILE__  ),
				array( 'leaflet' ),
				null,
				true
			);

			// jQuery Actual
			// Required by annotatedimage fields
			wp_enqueue_script( 
				'jquery_actual',
				plugins_url( 'components/jquery.actual/jquery.actual.min.js', __FILE__ ),
				array( 'jquery' ),
				null,
				true
			);

			// Flat Image Zoom
			// Required by annotatedimage fields
			wp_enqueue_script(
				'flat_image_zoom',
				plugins_url( 'components/flat_image_zoom/flat_image_zoom.js', __FILE__ ),
				array( 
					'jquery', 
					'leaflet', 
					'leaflet_draw', 
					'jquery_actual', 
					'underscore',
				),
				null,
				true
			);

			// Griot
			wp_enqueue_style(
				'griot',
				plugins_url( 'css/griot.css', __FILE__ ),
				false
			);
			wp_enqueue_script(
				'griot',
				plugins_url( 'js/griot.js', __FILE__ ),
				'angular',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-main',
				plugins_url( 'js/controllers/main.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-modelchain',
				plugins_url( 'js/services/modelchain.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-get-title',
				plugins_url( 'js/filters/get-title.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-annotatedimage',
				plugins_url( 'js/directives/annotatedimage.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-annotations',
				plugins_url( 'js/directives/annotations.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-ckeditor',
				plugins_url( 'js/directives/ckeditor.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-field',
				plugins_url( 'js/directives/field.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-fieldset',
				plugins_url( 'js/directives/fieldset.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-repeater-fields',
				plugins_url( 'js/directives/griot-repeater-fields.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-repeater',
				plugins_url( 'js/directives/repeater.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script( 
				'griot-image',
				plugins_url( 'js/directives/imagepicker.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script(
				'griot-switch',
				plugins_url( 'js/directives/switch.js', __FILE__ ),
				'griot',
				null,
				true
			);
			wp_enqueue_script(
				'griot-switchgroup',
				plugins_url( 'js/directives/switchgroup.js', __FILE__ ),
				'griot',
				null,
				true
			);

			// WordPress media manager scripts
			wp_enqueue_media();
			wp_enqueue_script( 'custom-header' );

			// Print application data
			$this->print_data( $screen->id );

		}

		// Enqueue special scripts and styles for settings page
		if( 'settings_page_griotwp' == $screen->id ) {

			// Griot Settings
			wp_enqueue_style(
				'griot_settings',
				plugins_url( 'css/griot-settings.css', __FILE__ ),
				false
			);
			wp_enqueue_script(
				'griot_settings',
				plugins_url( 'js/griot-settings.js', __FILE__ ),
				false,
				null,
				true
			);

		}

	}


	/**
	 * Print application data and settings for application
	 * 
	 * @since 0.0.1
	 */
	function print_data( $screen_id ) {

		global $post;

		// Convert available image list into array
		$imageList = explode( "\r\n", get_option( 'griot_image_list' ) );

		// Construct data dump object for application
		$griotData = array(

			'recordType'  => $screen_id,
			'templateUrl' => $this->templates[ $screen_id ],
			'title'       => $post->post_title,
			'data'        => $post->post_content,
			'recordList'  => get_option( 'griot_record_list' ),
			'tilejson'    => get_option( 'griot_tilejson_base_url' ),
			'imageSrc'    => get_option( 'griot_image_source', 'wordpress' ),
			'imageList'   => $imageList,

		);

		// Print to page
		wp_localize_script(
			'griot',
			'griotData',
			$griotData
		);

	}


	/**
	 * Register metabox for related posts field
	 *
	 * @since 0.0.1
	 */
	function register_related_records_metabox() {

		// Return early if we're not on an object page.
		$screen = get_current_screen();

		if( $screen->id != 'object' ) {

			return;

		}

		// Add meta box
		add_meta_box(
			'griot-related-records',
			 __( 'Related Stories', 'griot' ),
			array( $this, 'related_records_metabox_template' ),
			'object',
			'side'
		);

	}


	/**
	 * Callback that prints Angular template to related records metabox.
	 *
	 * @since 0.0.1
	 */
	function related_records_metabox_template() {

		echo "<field name='related' type='relationship' />";

	}


	/**
	 * Register settings page
	 *
	 * @since 0.0.1
	 */
	function register_settings_page() {

		add_options_page(
			'GriotWP Settings',
			'GriotWP',
			'manage_options',
			'griotwp',
			array( $this, 'render_settings_page' )
		);

	}


	/**
	 * Render settings page
	 *
	 * @since 0.0.1
	 */
	function render_settings_page() {
	?>

	<div class="wrap">

		<?php screen_icon(); ?>
		<h2>GriotWP Settings</h2>      

		<form method="post" action="options.php">

			<?php

			settings_fields( 'griot_settings' );   
			do_settings_sections( 'griotwp' );
			submit_button(); 

			?>

		</form>

  </div>

  <?php
	}


	/**
	 * Register settings
	 *
	 * @since 0.0.1
	 */
	function register_settings() {

		register_setting( 'griot_settings', 'griot_tilejson_base_url', array( $this, 'sanitize_tilejson_base_url_field' ) );
		register_setting( 'griot_settings', 'griot_image_source' );
		register_setting( 'griot_settings', 'griot_image_list' );

		add_settings_section( 'griot_image_settings', 'Image Settings', null, 'griotwp' );  

		add_settings_field( 'griot_tilejson_base_url', 'TileJSON Base URL', array( $this, 'render_tilejson_base_url_field' ), 'griotwp', 'griot_image_settings' );
		add_settings_field( 'griot_image_source', 'Image Source', array( $this, 'render_image_source_field' ), 'griotwp', 'griot_image_settings' );      
		add_settings_field( 'griot_image_list', 'Available Images', array( $this, 'render_image_list_field' ), 'griotwp', 'griot_image_settings' );      

	}


	/**
	 * Render TileJSON Base URL field
	 *
	 * @since 0.0.1
	 */
	function render_tilejson_base_url_field() {

		$content = get_option( 'griot_tilejson_base_url' );

		?>

		<input type='text' name='griot_tilejson_base_url' value='<?php echo $content; ?>' />

		<?php
	}


	/**
	 * Add a trailing slash to TileJSON Base URL field if not included
	 *
	 * @since 0.0.1
	 */
	function sanitize_tilejson_base_url_field( $input ) {

		$sanitized = substr( $input, -1 ) == '/' ? $input : $input . '/';

		return $sanitized;

	}


	/**
	 * Render image source field
	 *
	 * @since 0.0.1
	 */
	function render_image_source_field() {

		$value = get_option( 'griot_image_source' );

		?>

		<div id='griot-image-source-setting'>
			<input id='griot-image-source-setting-wordpress' type='radio' name='griot_image_source' value='wordpress' <?php checked( $value, 'wordpress' ); ?> /><label for='griot-image-source-setting-wordpress'>Insert images from WordPress</label><br />
			<input id='griot-image-source-setting-external' type='radio' name='griot_image_source' value='external' <?php checked( $value, 'external' ); ?> /><label for='griot-image-source-setting-external'>Add a list of available image URLs</label>
		</div>

		<?php
	}


	/**
	 * Render image list field
	 *
	 * @since 0.0.1
	 */
	function render_image_list_field() {

		$content = get_option( 'griot_image_list' );

		?>

		<textarea id='griot-image-list-setting' name='griot_image_list'><?php echo $content; ?></textarea>

		<?php
	}


	/**
	 * Set up plugin
	 * 
	 * @since 0.0.1
	 * @param array $templates Templates to be used for each post type.
	 */
	function __construct( $templates ) {

		// Activation: update rewrite rules and build list of records
		register_activation_hook( __FILE__, array( $this, 'flush_rewrite_rules' ) );
		register_activation_hook( __FILE__, array( $this, 'build_record_list' ) );

		// Deactivation: update rewrite rules
		register_deactivation_hook( __FILE__, array( $this, 'flush_rewrite_rules' ) );

		// Register templates
		$this->templates = $templates;

		// Register Object and Story post types
		add_action( 'init', array( $this, 'register_object_cpt' ) );
		add_action( 'init', array( $this, 'register_story_cpt' ) );

		// Register endpoint
		add_action( 'init', array( $this, 'register_endpoint' ) );
		add_action( 'template_redirect', array( $this, 'redirect_endpoint' ) );

		// Rebuild record list when post structure changes
		add_action( 'save_post', array( $this, 'build_record_list' ) );
		add_action( 'trashed_post', array( $this, 'build_record_list' ) );
		add_action( 'untrashed_post', array( $this, 'build_record_list' ) );
		add_action( 'deleted_post', array( $this, 'build_record_list' ) );

		// If this page is managed by the plugin, enqueue scripts and styles
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts_and_styles' ) );

		// Add related records metabox
		add_action( 'add_meta_boxes', array( $this, 'register_related_records_metabox' ) );

		// Add settings page and settings
		add_action( 'admin_menu', array( $this, 'register_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
 
	}

}