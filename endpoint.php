<?php

global $wpdb;

// Get vars appended to 'griot' endpoint
$query_vars = get_query_var( 'griot' );
$query_arr = explode( '/', $query_vars );

if( 0 == count( $query_arr ) ) {
	
	// No extra endpoints; return all data
	$request = 'all';

}
else if( ! in_array( $query_arr[0], array( 'objects', 'stories' ) ) ) {

	// Malformed
	$request = 'all';

}
else if( 1 == count( $query_arr ) && in_array( $query_arr[0], array( 'objects', 'stories' ) ) {

	// e.g. '/griot/objects/'
	$request = $query_arr[0];

} 
else if( is_numeric( $query_arr[1] ) ) {

	// e.g. '/griot/objects/370/'
	$request = $query_arr[1];

}
else {

	// e.g. '/griot/objects/wrong/'
	$request = 'all';

}

// Return JSON
switch( $request ) {

	case 'all':

		$posts = $wpdb->get_results( "SELECT post_type, post_content FROM $wpdb->posts WHERE post_status = 'publish' AND ( post_type = 'object' OR post_type = 'story' )", OBJECT );

		$output = array(
			'objects' => array(),
			'stories' => array(),
		);

		foreach( $posts as $post ) {

			if( 'object' == $post->post_type ) {
				$output['objects'][] = json_decode( $post->post_content, true );
			}

			if( 'story' == $post->post_type ) {
				$output['stories'][] = json_decode( $post->post_content, true );
			}

		}

		echo json_encode( $output );

		break;

	case 'objects':
	case 'stories':

		$post_type = $request == 'objects' ? 'object' : 'story';

		$posts = $wpdb->get_col( 
			$wpdb->prepare(
				"SELECT post_content FROM $wpdb->posts WHERE post_status = 'publish' AND post_type = %s",
				$post_type
			)
		);

		$output = array();

		foreach( $posts as $post_content ) {

			$output[] = json_decode( $post_content );

		}

		echo json_encode( $output );

		break;

	default:

		$output = $wpdb->get_var( 
			$wpdb->prepare( 
				"SELECT post_content FROM $wpdb->posts WHERE post_status = 'publish' AND ID = %d",
				$request 
			)
		);

		echo $output;

		break;

}