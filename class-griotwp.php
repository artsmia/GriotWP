<?php

/**
 * The main class for the plugin.
 * 
 * Sets up WordPress structures for working with records and exposes data for
 * Angular through wp_localize_script. 
 *
 * @since 0.0.1
 */
class GriotWP{


	/**
	 * Flush rewrite rules. Called on activation and deactivation.
	 *
	 * @since 0.0.1
	 */
	static function flush_rewrite_rules() {
		flush_rewrite_rules();
	}


	/**
	 * Register Object custom post type.
	 *
	 * @since 0.0.1
	 */
	function register_object_cpt() {

		global $wp_version;
		$icon = $wp_version >= 3.8 ? 'dashicons-format-image' : null;

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
			'supports'            => array( 'title', 'revisions', 'author' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'menu_icon'           => $icon,
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

		global $wp_version;
		$icon = $wp_version >= 3.8 ? 'dashicons-book' : null;

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
			'supports'            => array( 'title', 'revisions', 'author' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'menu_icon'           => $icon,
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
	 * Register Panel custom post type.
	 *
	 * @since 0.0.1
	 */
	function register_panel_cpt() {

		global $wp_version;
		$icon = $wp_version >= 3.8 ? 'dashicons-screenoptions' : null;

		$labels = array(
			'name'                => _x( 'Panels', 'Post Type General Name', 'griot' ),
			'singular_name'       => _x( 'Panel', 'Post Type Singular Name', 'griot' ),
			'menu_name'           => _x( 'Panels', 'Post Type Menu Name', 'griot' ),
			'parent_item_colon'   => __( 'Parent Panel:', 'griot' ),
			'all_items'           => __( 'All Panels', 'griot' ),
			'view_item'           => __( 'View Panel', 'griot' ),
			'add_new_item'        => __( 'Add New Panel', 'griot' ),
			'add_new'             => __( 'Add New', 'griot' ),
			'edit_item'           => __( 'Edit Panel', 'griot' ),
			'update_item'         => __( 'Update Panel', 'griot' ),
			'search_items'        => __( 'Search Panels', 'griot' ),
			'not_found'           => __( 'Not found', 'griot' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'griot' ),
		);

		$rewrite = array(
			'slug'                => _x( 'panels', 'URL Slug', 'griot' ),
			'with_front'          => false,
			'feeds'               => true,
			'pages'               => false,
		);

		$args = array(
			'label'               => __( 'panel', 'griot' ),
			'description'         => __( 'Represents a static panel on the cover of the application.', 'griot' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'revisions', 'author' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'menu_icon'           => $icon,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
			'rewrite'             => $rewrite,
		);

		register_post_type( 'panel', $args );

	}


	/**
	 * Register user posts table.
	 *
	 * @since 0.0.1
	 */
	static function register_media_status_table() {

		global $wpdb;

		$table_name = $wpdb->prefix . "gwp_media_status";

		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			`ID` int(11) NOT NULL AUTO_INCREMENT,
			`post_id` int(11) NOT NULL,
			`media` varchar(45) NOT NULL,
			`status` varchar(45) NOT NULL,
			PRIMARY KEY (`ID`) )";

		$wpdb->query($sql);

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

		if( $wp_query->query_vars['name'] != 'griot' ) {
			return;
		}

		status_header(200);
		include( 'endpoint.php' );

		exit;

	}


	/**
	 * Build a list of story and object records for use in related record fields.
	 *
	 * @since 0.0.1
	 */
	static function build_record_list() {

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

		// If version is less than 3.8, add dashicons fonts and styles
		global $wp_version;
		if( $wp_version < 3.8  && is_admin() ) {

			wp_enqueue_style(
				'dashicons',
				plugins_url( 'components/dashicons/dashicons.css', __FILE__ ),
				false
			);
			wp_enqueue_style(
				'gwp_dashicons',
				plugins_url( 'css/dashicons.css', __FILE__ ),
				false
			);

		}

		// Editing screens managed by GriotWP
		$controlled_screens = array( 'object', 'story', 'panel' );
		if( in_array( $screen->id, $controlled_screens ) ) {

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

			wp_enqueue_script(
				'gwp_js',
				plugins_url( 'dist/gwp.js', __FILE__ ),
				array( 'angular', 'jquery', 'jquery-ui-core', 'jquery-ui-draggable', 'jquery-ui-droppable' ),
				null,
				true
			);

			// WordPress media manager scripts
			wp_enqueue_media();
			wp_enqueue_script( 'custom-header' );

			// Print application data
			$this->print_data( $screen->id );

		}

		// Dashboard needs to be styled, but we don't want to include the JS.
		$styled_screens = array( 'object', 'story', 'panel', 'dashboard' );
		if( in_array( $screen->id, $styled_screens ) ) {

			// Griot
			wp_enqueue_style(
				'gwp_css',
				plugins_url( 'css/gwp.css', __FILE__ ),
				false
			);

		}

		// Enqueue special scripts and styles for settings page
		if( 'settings_page_griotwp' == $screen->id ) {

			wp_enqueue_script(
				'griot_settings',
				plugins_url( 'js/gwp-settings.js', __FILE__ ),
				false,
				null,
				true
			);

			wp_enqueue_style(
				'gwp_css',
				plugins_url( 'css/gwp.css', __FILE__ ),
				false
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

		$imageList = explode( "\r\n", get_option( 'griot_image_list' ) );

		$config_url = get_option( 'griot_config_url' );
		$tile_server = get_option( 'griot_tile_server' );

		$griotData = array(

			'recordType'      => $screen_id,
			'templateUrl'     => $this->templates[ $screen_id ],
			'postID'          => $post->ID,
			'title'           => $post->post_title,
			'data'            => $post->post_content,
			'recordList'      => get_option( 'griot_record_list' ),
			'imageSrc'        => get_option( 'griot_image_source', 'wordpress' ),
			'imageList'       => $imageList,
			'tileServer'      => $tile_server,
			'config'          => json_decode( $this->get_config( $config_url ) ),
			'trackMediaNonce' => wp_create_nonce( 'track_media_for_user_' . get_current_user_id() ),
		);

		wp_localize_script(
			'gwp_js',
			'griotData',
			$griotData
		);

	}

	function disable_fancy_TinyMCE_paste_features($in) {
		$in['paste_remove_styles'] = true;
		$in['paste_remove_spans'] = true;
		$in['paste_strip_class_attributes'] = 'all';
		$in['paste_text_use_dialog'] = false;
		return $in;
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
			array( $this, 'render_related_records_metabox' ),
			'object',
			'side'
		);

	}


	/**
	 * Callback that prints Angular template to related records metabox.
	 *
	 * @since 0.0.1
	 */
	function render_related_records_metabox() {
		?>

		<p>Select stories related to this object.</p>
		<p><em>CTRL+click to select multiple stories;<br />SHIFT+click to select a range.</em></p>
		<field name='relatedStories' type='relationship' />

		<?php
	}


	/**
	 * Register metabox for related posts field
	 *
	 * @since 0.0.1
	 */
	function register_track_media_metabox() {

		$screen = get_current_screen();
		$edit_screens = array( 'object' );
		if( ! in_array( $screen->id, $edit_screens ) ) {
			return;
		}

		// Add meta box
		add_meta_box(
			'griot-track-media',
			 __( 'Track Media', 'griot' ),
			array( $this, 'render_track_media_metabox' ),
			$screen->id,
			'side'
		);

	}


	/**
	 * Callback that prints Angular template to related records metabox.
	 *
	 * @since 0.0.1
	 */
	function render_track_media_metabox() {

		global $post;

		$screen = get_current_screen();
		$tracked_posts = get_user_meta( get_current_user_id(), 'gwp_tracked_posts', true );
		$checked = is_array( $tracked_posts ) && in_array( $post->ID, $tracked_posts ) ? 'checked' : '';
		?>

		<input track-media type='checkbox' id='griot-toggle-track-media' <?php echo $checked; ?> />
		<label for='griot-toggle-track-media'>Track "View" images on dashboard</label>
		<span class='griot-track-media-saved'>Saved</span>

		<?php
	}	


		/**
	 * Register media tracker dashboard widget
	 *
	 * @since 0.0.1
	 */
	function register_track_media_widget() {
		wp_add_dashboard_widget(
			'gwp_track_media_widget',
			'Manage Media',
			array( $this, 'render_track_media_widget' )
		);	
	}


	/**
	 * Render media tracker dashboard widget
	 *
	 * @since 0.0.1
	 */
	function render_track_media_widget(){

		global $wpdb;

		$screen = get_current_screen();

		$tracked_posts = get_user_meta( get_current_user_id(), 'gwp_tracked_posts', true );

		if( ! is_array( $tracked_posts ) || empty( $tracked_posts ) ){
			echo "No tracked media found.";
			return;
		}

		foreach( $tracked_posts as $post_id ){
			$table = $wpdb->prefix . 'gwp_media_status';
			$images = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . $table . ' WHERE post_id = %d',
					$post_id
				),
				ARRAY_A
			);
			?>

			<div class='griot-tracker-item'>
				<p class='griot-tracker-title'>
					<a href='<?php echo get_edit_post_link( $post_id ); ?>'><?php echo get_the_title( $post_id ); ?></a>
				</p>
				<ul class='griot-tracker-list'>

					<?php
					foreach( $images as $image ){
						$class = $image['status'] == 'final' ? 'griot-final' : 'griot-fpo';
						?>

						<li class='griot-tracker-list-item <?php echo $class; ?>'><?php echo $image['media']; ?></li>

						<?php
					}
					if( empty( $images ) ){
						echo "<li class='griot-tracker-list-item'>No tracked media found.</li>";
					}
					?>

				</ul>
			</div>

			<?php				
		}
	}


	/**
	 * Check post content for zoomable images.
	 *
	 * @since 0.0.1
	 */
	function check_post_media( $post_id ){

		global $wpdb;

		if( ! array_key_exists( 'content', $_POST )
			|| ! array_key_exists( 'post_type', $_POST )
			|| $_POST['post_type'] != 'object'
			|| wp_is_post_revision( $post_id ) 
			|| wp_is_post_autosave( $post_id ) ){
			return;
		}

		$image_ids = array();

		$content_json = stripslashes( $_POST['content'] );
		$content = json_decode( $content_json, true );
		if( array_key_exists( 'views', $content ) ){
			foreach( $content['views'] as $view ){
				if( ! in_array( $view['image'], $image_ids ) ){
					array_push( $image_ids, $view['image'] );
				}
			}
		}

		$image_list = array();

		$config_json = $this->get_config();
		$config = json_decode( $config_json, true );

		foreach( $config as $object ){
			foreach( $object['images'] as $image ){
				$image_id = str_replace( '.tif', '', $image['file'] );
				$image_list[ $image_id ] = $image['approved'];
			}
		}

		// Clear out old image records for this post
		$wpdb->delete( 
			$wpdb->prefix . 'gwp_media_status', 
			array( 
				'post_id' => $post_id 
			)
		);

		// Add new image records for this post
		foreach( $image_ids as $image_id ){
			$status = $image_list[ $image_id ] == 1 ? 'final' : 'fpo';
			$wpdb->insert( 
				$wpdb->prefix . 'gwp_media_status', 
				array(
					'post_id' => $post_id,
					'media' => $image_id,
					'status' => $status,
					),
				array(
					'%d',
					'%s',
					'%s',
				)
			);
		}
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

		register_setting( 'griot_settings', 'griot_tile_server', array( $this, 'sanitize_url' ) );
		register_setting( 'griot_settings', 'griot_config_url' );
		register_setting( 'griot_settings', 'griot_image_source' );
		register_setting( 'griot_settings', 'griot_image_list' );

		add_settings_section( 'griot_server_settings', 'Servers and Data', null, 'griotwp' );
		add_settings_section( 'griot_static_image_settings', 'Static Images', array( $this, 'render_static_image_section' ), 'griotwp' );

		add_settings_field( 'griot_tile_server', 'Tile Server', array( $this, 'render_tile_server_field' ), 'griotwp', 'griot_server_settings' );
		add_settings_field( 'griot_config_url', 'Config', array( $this, 'render_config_url_field' ), 'griotwp', 'griot_server_settings' );
		add_settings_field( 'griot_image_source', 'Image Source', array( $this, 'render_image_source_field' ), 'griotwp', 'griot_static_image_settings' );      
		add_settings_field( 'griot_image_list', 'Available Static Images', array( $this, 'render_image_list_field' ), 'griotwp', 'griot_static_image_settings' );      

	}


	/**
	 * Render Static Image settings section
	 *
	 * @since 0.0.1
	 */
	function render_static_image_section() {
		?>
		<p>NOTE: Static images are not used in the default configuration of Griot (all images are zoomable). However, a static image field and related settings are provided for extensibility.</p>
		<?php
	}


	/**
	 * Render Tile Server field
	 *
	 * @since 0.0.1
	 */
	function render_tile_server_field() {

		$content = get_option( 'griot_tile_server' );

		?>

		<input type='text' name='griot_tile_server' id='griot-tile-server' value='<?php echo $content; ?>' />

		<?php
	}


	/**
	 * Render Config URL field
	 *
	 * @since 0.0.1
	 */
	function render_config_url_field() {

		$content = get_option( 'griot_config_url' );

		?>

		<input type='text' name='griot_config_url' id='griot-config-url' value='<?php echo $content; ?>' />
		<p id='griot-config-url-response'></p>

		<?php
	}


	/**
	 * Add a trailing slash to Tile Server field if not included
	 *
	 * @since 0.0.1
	 */
	function sanitize_url( $input ) {

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
	 * Get config JSON from remote server
	 *
	 * @since 0.0.1
	 * @param string $config_url The URL from which to retrieve the config json.
	 * Defaults to the stored config url value.
	 * @return string The config data in JSON format
	 */
	function get_config( $config_url=null ) {

		if( ! $config_url ){
			$config_url = get_option( 'griot_config_url' );
		}

		$ch = curl_init( $config_url );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		$json = curl_exec( $ch );
		curl_close( $ch );

		if( ! json_decode( $json ) ) {
			return "ERROR: Cannot retrieve config. Please check your tile server settings.";
		} else {
			return $json;
		}

	}


	/**
	 * Check server URL entered in settings to make sure config exists and is
	 * not malformed (AJAX callback)
	 *
	 * @since 0.0.1
	 */
	function check_config() {

		$config_url = $_POST[ 'config_url' ];

		$json = $this->get_config( $config_url );

		$config = json_decode( $json, true );

		if( $config ) {
			echo $json;
		} else {
			echo 'error';
		}

		die;
	
	}


	/**
	 * Update user media tracking (AJAX callback)
	 */
	function update_media_tracking(){

		check_admin_referer( 'track_media_for_user_' . get_current_user_id() );

		$post_id = $_POST[ 'track_id' ];
		$status = $_POST[ 'track_status' ];
		$user_id = get_current_user_id();
		$result = false;

		$tracked_posts = get_user_meta( $user_id, 'gwp_tracked_posts', true );
		if( ! is_array( $tracked_posts ) ){
			$tracked_posts = array();
		}

		$in_array = in_array( $post_id, $tracked_posts );

		switch( $status ){
			case 'untrack':

				if( ! $in_array ){
					$result = true;
					break;
				}

				$index = array_search( $post_id, $tracked_posts );
				array_splice( $tracked_posts, $index );
				$result = update_user_meta( $user_id, 'gwp_tracked_posts', $tracked_posts );

				break;

			case 'track':

				if( $in_array ){
					$result = true;
					break;
				}

				array_push( $tracked_posts, $post_id );
				$result = update_user_meta( $user_id, 'gwp_tracked_posts', $tracked_posts );

				break;
		}

		echo $result === false ? 'error' : 'success';

		die;

	}


	/**
	 * Set up plugin
	 * 
	 * @since 0.0.1
	 * @param array $templates Templates to be used for each post type.
	 */
	function __construct( $templates ) {

		// Register templates
		$this->templates = $templates;

		// Register Object and Story post types
		add_action( 'init', array( $this, 'register_object_cpt' ) );
		add_action( 'init', array( $this, 'register_story_cpt' ) );
		add_action( 'init', array( $this, 'register_panel_cpt' ) );

		// Register endpoint
		add_action( 'init', array( $this, 'register_endpoint' ) );
		add_action( 'template_redirect', array( $this, 'redirect_endpoint' ) );

		// Rebuild record list when post structure changes
		add_action( 'save_post', array( $this, 'build_record_list' ) );
		add_action( 'deleted_post', array( $this, 'build_record_list' ) );

		// If this page is managed by the plugin, enqueue scripts and styles
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts_and_styles' ) );

		// Add metaboxes
		add_action( 'add_meta_boxes', array( $this, 'register_related_records_metabox' ) );
		add_action( 'add_meta_boxes', array( $this, 'register_track_media_metabox' ) );

		// Add dashboard widget
		add_action( 'wp_dashboard_setup', array( $this, 'register_track_media_widget' ) );

		// Add save post callback to check for zoomable media
		add_action( 'save_post', array( $this, 'check_post_media' ) );

		// Add settings page and settings
		add_action( 'admin_menu', array( $this, 'register_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Add config callback for settings page
		add_action( 'wp_ajax_griot_get_config', array( $this, 'check_config' ) );
		add_action( 'wp_ajax_griot_track_media', array( $this, 'update_media_tracking' ) );

		// Don't let pasting from web browsers or Word cause invalid JSON problems.
		add_filter('tiny_mce_before_init', 'disable_fancy_TinyMCE_paste_features');

	}

}
