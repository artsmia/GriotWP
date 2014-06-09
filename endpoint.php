<?php

header( 'Access-Control-Allow-Origin: *' );

global $wpdb;

// Get data
$posts = $wpdb->get_results( 
	"SELECT ID, post_title, post_type, post_content 
		FROM $wpdb->posts 
		WHERE post_status = 'publish' 
		AND ( post_type = 'object' OR post_type = 'story' OR post_type = 'panel' )", 
	OBJECT 
);

$manifest = array(
	'objects' => array(),
	'stories' => array(),
	'panels' => array(),
);

foreach( $posts as $post ) {

	if( 'object' == $post->post_type ) {

		// Objects are keyed to user-defined object IDs, rather than WP ID
		$object_json = json_decode( $post->post_content, true );

		if( ! array_key_exists( 'id', $object_json ) ){
			continue;
		}
		
		$object_id = $object_json[ 'id' ];
		$manifest['objects'][ $object_id ] = $object_json;

	}

	if( 'story' == $post->post_type ) {
		$manifest['stories'][ $post->ID ] = json_decode( $post->post_content, true );
	}

	if( 'panel' == $post->post_type ) {
		$manifest['panels'][ $post->ID ] = array(
			'title' => $post->post_title,
			'content' => $post->post_content,
		);
	}

}


// Get vars appended to 'griot' endpoint
$query_vars = get_query_var( 'griot' );
$query_arr = explode( '/', $query_vars );

if( 0 == count( $query_arr ) ) {
	
	// No extra endpoints; return all data
	$request = 'all';

}
else if( ! in_array( $query_arr[0], array( 'objects', 'stories', 'panels' ) ) ) {

	// Malformed
	$request = 'all';

}
else if( 1 == count( $query_arr ) ) {

	// e.g. '/griot/objects/'
	$request = 'group';
	$request_type = $query_arr[0];

} 
else if( 2 == count( $query_arr ) && is_numeric( $query_arr[1] ) ) {

	// e.g. '/griot/objects/370/'
	$request = 'single';
	$request_type = $query_arr[0];
	$request_id = $query_arr[1];

}
else {

	$request = 'all';
	
}

// Return JSON
switch( $request ) {

	case 'group':

		$output = $manifest[ $request_type ];
		echo json_encode( $output );
		break;

	case 'single':

		$output = $manifest[ $request_type ][ $request_id ];
		echo json_encode( $output );
		break;

	case 'all':
	default:

		echo json_encode( $manifest );
		break;
	
}