jQuery( document ).ready( function() {

	/** 
	 * Tile server field
	 */
	jQuery( "input[name='griot_config_url']" ).on( 'change', function( e ) {

		if( ! e.target.value ) {
			jQuery( '#griot-config-url-response' ).fadeOut( 200, function(){
				jQuery( this ).removeClass( 'error success' ).html( '' );
			});
			return;
		}

		jQuery( '#griot-config-url-response' ).removeClass( 'success error' ).html( 'Fetching config ...' ).fadeIn( 200 );

		var request = {
			action: 'griot_get_config',
			config_url: e.target.value
		};

		jQuery.post( ajaxurl, request, function( data ) {

			if( 'error' === data ) {
				jQuery( '#griot-config-url-response' ).removeClass( 'success' ).addClass( 'error' ).html( '<strong>Error:</strong> The config cannot be read. It may be missing, inaccessible, or malformed.' ).fadeIn( 200 );
				return;
			}

			var config = JSON.parse( data ),
			  objectCount = 0,
			  imageCount = 0;

			for( var prop in config ) {
				if( config.hasOwnProperty( prop ) ){
					objectCount++;
					imageCount += config[prop].images.length;
				}
			}

			jQuery( '#griot-config-url-response' ).removeClass( 'error' ).addClass( 'success' ).html( '<strong>Success!</strong> Found <strong>' + objectCount + '</strong> objects and <strong>' + imageCount + '</strong> zoomable images.' ).fadeIn( 200 );

		});

	});


	/**
	 * Static image source fields
	 */
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