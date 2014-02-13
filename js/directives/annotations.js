/**
 * annotations="" directive
 *
 * Adds listeners and callbacks to repeaters that represent image annotations.
 */
angular.module( 'griot' ).directive( 'annotations', function( $timeout, $compile ) {

	return {

		restrict: 'A',
		require: ['repeater','^annotatedimage'],
		link: function( scope, elem, attrs, ctrls ) {

			var _this = this;

			// Define controllers
			var repeaterCtrl = ctrls[0];
			var imageCtrl = ctrls[1];

			// Get imageCtrl scope
			var imageScope = imageCtrl.getScope();

			// Delete Add Annotation button and replace with Zoom Out button
			var zoomButton = angular.element( "<a class='griot-button' ng-show='hasMap()' ng-click='zoomOut()'>Zoom Out</a>" );
			var compiled = $compile( zoomButton );
			elem.find( '.griot-button' ).first().replaceWith( zoomButton );
			compiled( imageScope );

			/**
			 * Change focused image area when user advances repeater slider
			 */
			scope.$watch( 
				function() {
					return repeaterCtrl.getActiveIndex();
				},
				function() {
					var zoomer = imageCtrl.getZoomer();
					var annotations = imageCtrl.getAnnotations();
					if( ! annotations[ repeaterCtrl.getActiveIndex() ] ) {
						return;
					}
					var geoJSON = annotations[ repeaterCtrl.getActiveIndex() ].geoJSON;
					var layer = L.GeoJSON.geometryToLayer( geoJSON.geometry );
					if( zoomer ) {
						zoomer.map.fitBounds( layer );
					}
				}
			);

			/**
			 * Attach listeners to zoomer on creation
			 */
			scope.$watch(
				function() {
					return imageCtrl.getZoomer();
				},
				function( zoomer ) {
					if( zoomer ) {

						angular.forEach( imageCtrl.imageLayers._layers, function( layer ) {

							layer.on( 'click', function( e ){

								if( ! _this.deleting ) {
								
									var clickedAnnotation = e.target.annotation;

									var index = jQuery.inArray( clickedAnnotation, imageCtrl.annotations );

									repeaterCtrl.swipeTo( index );

								}

							});

						});

						zoomer.map.on( 'draw:deletestart', function() {

							_this.deleting = true;

						});

						zoomer.map.on( 'draw:deletestop', function() {

							_this.deleting = false;

						});


						/**
						 * Sync annotations created via zoomer
						 */
						zoomer.map.on( 'draw:created', function( e ) {

							// Create geoJSON from draw event
							var geoJSON = e.layer.toGeoJSON();

							scope.$apply( function() {

			    			// Add geoJSON to annotation record in data object
				    		var length = imageCtrl.annotations.push({
					    		geoJSON: geoJSON
					    	});

				    		// Get a reference to the new annotation
					    	var annotation = imageCtrl.annotations[ length - 1 ];

					    	// Convert geoJSON to layer
					    	var layer = L.GeoJSON.geometryToLayer( geoJSON.geometry );

					    	// Store reference in layer
								layer.annotation = annotation;

								// Add to local image layers collection
								imageCtrl.imageLayers.addLayer( layer );

								// Zoom in on image
								zoomer.map.fitBounds( layer );

								// Attach click handler
								layer.on( 'click', function( e ){

									if( ! _this.deleting ) {
									
										var clickedAnnotation = e.target.annotation;

										var index = jQuery.inArray( clickedAnnotation, imageCtrl.annotations );

										repeaterCtrl.swipeTo( index );

									}

								});

							});

						});


						/**
						 * Sync annotations deleted via zoomer
						 */
						zoomer.map.on( 'draw:deleted', function( e ) {

							var repeater = repeaterCtrl.getRepeater();

							var activeIndex = repeaterCtrl.getActiveIndex();
							var newActiveIndex = 0;

							var goodEggs = [];
							var badEggs = [];

							angular.forEach( e.layers._layers, function( layer ) {

								var index = jQuery.inArray( layer.annotation, imageCtrl.annotations );

								badEggs.push( index );

							});

							angular.forEach( imageCtrl.annotations, function( annotation, index ) {

								if( -1 === jQuery.inArray( index, badEggs ) ) {

									goodEggs.push( index );

								}

							});

							badEggs.reverse();

							for( var i = 0; i === badEggs.length; i++ ) {


								if( activeIndex === 0 ) {

									break;

								}

								if( activeIndex === badEggs[i] ) {

									activeIndex--;

								}

							}

							angular.forEach( goodEggs, function( goodEgg, index ) {

								if( activeIndex === goodEgg ) {

									newActiveIndex = index;

								}

							});

							angular.forEach( badEggs, function( badEgg ) {

								scope.$apply( function() {

										imageCtrl.annotations.splice( badEgg, 1 );
									
								});

							});

							repeater.swipeTo( newActiveIndex, 0, false );

						});


						/**
						 * Sync annotations edited via zoomer
						 */
						zoomer.map.on( 'draw:edited', function( e ) {

							angular.forEach( e.layers._layers, function( layer ) {

								var geoJSON = layer.toGeoJSON();

								scope.$apply( function() {

									layer.annotation.geoJSON = geoJSON;

								});
								
							});

						});

						/**
						 * Go to annotation on image area click
						 */
						zoomer.map.on( 'draw:')

					}
				}
			);
		}
	}
});