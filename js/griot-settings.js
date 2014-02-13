jQuery( document ).ready( function() {

	if( jQuery( '#griot-image-source-setting-external' ).is( ':checked' ) ) {

		jQuery( '#griot-image-list-setting' ).closest( 'tr' ).show();

	} else {

		jQuery( '#griot-image-list-setting' ).closest( 'tr' ).hide();

	}

	jQuery( "input[name='griot_image_source']" ).on( 'change', function() {

		if( jQuery( '#griot-image-source-setting-external' ).is( ':checked' ) ) {

			jQuery( '#griot-image-list-setting' ).closest( 'tr' ).fadeIn( 100 );

		} else {

			jQuery( '#griot-image-list-setting' ).closest( 'tr' ).fadeOut( 100 );

		}

	});
	
});