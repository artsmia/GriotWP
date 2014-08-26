angular.module( 'griot' ).directive( 'trackMedia', function() {
	
	// Basically wrapping a jQuery control, because it's a PITA to use Angular's
	// methods to do AJAX in WordPress.
	return function( scope, elem, attrs ){

		var $elem = jQuery( elem );

		$elem.on( 'change', function(){
			
			var trackMediaRequest = {
				action: 'griot_track_media',
				track_id: griotData.postID,
				track_status: $elem.prop( 'checked' ) ? 'track' : 'untrack',
				_wpnonce: griotData.trackMediaNonce
			};

			jQuery.post( ajaxurl, trackMediaRequest, function( response ) {

				if( 'error' === response ) {
					alert( "Sorry, this feature isn't working at the moment. Please try again soon." );
					return;
				} else {
					jQuery('.griot-track-media-saved').show().delay(1500).fadeOut(500);
				}

			});

		});

	};

});