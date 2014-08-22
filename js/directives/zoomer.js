/**
 * <zoomer> directive
 *
 * Sets up a (non-isolate) scope and controller and prints fields needed to
 * add and annotate zoomable images.
 */
angular.module( 'griot' ).directive( 'zoomer', function( $http, ModelChain ) {

	return {

		restrict: 'E',
		replace:true,
		template: function( elem, attrs ) {

			var transcrude = elem.html();
			attrs.hasAnnotations = transcrude ? true : false;

			var templateHtml = "<div class='griot-annotated-image'>" +
				"<div class='griot-zoomer griot-prevent-swipe' id='zoomer" + Math.floor( Math.random() * 1000000 ) + "-{{$id}}' ng-class='{ hasAnnotations: hasAnnotations, noAnnotations: !hasAnnotations, isDroppable: isDroppable }' />";

			if( transcrude ) {

				templateHtml +=	"<repeater annotations label='" + attrs.annotationsLabel + "' name='" + attrs.annotationsName + "' label-singular='" + attrs.annotationsLabelSingular + "' label-plural='" + attrs.annotationsLabelPlural + "'>" +
						transcrude +
					"</repeater>";

			}

			templateHtml += "</div>";

			return templateHtml;

		},
		controller: function( $scope, $element, $attrs, $timeout ) {

			var _this = this;

			$scope.isDroppable = false;

			/**
			 * Check to see if image ID leads to tiles
			 */
			$scope.checkForTiles = function() {

				// Get new image ID from model
				var newImageID = $scope.model[ $attrs.name ];

				// Do nothing if zoomer exists and image ID has not changed
				if( newImageID === $scope.imageID && 'undefined' !== typeof $scope.zoomer ) {
					console.log( 'exiting, zoomer exists and ID has not changed.' );
					return;
				}

				// Return if image ID is blank
				if( ! newImageID ) { 
					_this.destroyZoomer( true );
					console.log( 'destroying, no ID' );
					return;
				}

				// Build tile server URL
				$scope.tilejson = $scope.ui.tileServer + newImageID + '.tif';

				// Get tile data if it exists and build or destroy zoomer accordingly
				var http = $http.get( $scope.tilejson );
				http.success( function( tileData ) { 

					$scope.tileData = tileData;

					// Hard destroy
					_this.destroyZoomer( true );

					// Setup and build
					console.log( 'have data, setting up' );
					_this.setupZoomer( false );

				});
				http.error( function( e ) {

					console.log( 'Destroying, no tile data' );
					_this.destroyZoomer( true );

				});

			};


			/**
			 * Build zoomer
			 */
			this.setupZoomer = function( buildZoomer ) {

				if( 'undefined' === typeof buildZoomer ){
					buildZoomer = false;
				}

				$scope.imageID = $scope.model[ $attrs.name ];

				$scope.tilesURL = $scope.tileData.tiles[0];

				// Get container ID
				// NOTE: Can't get it on init, because the {{index}} component will 
				// not have been interpolated by Angular yet
				$scope.container_id = $element.find( '.griot-zoomer' ).first().attr( 'id' );

				if( buildZoomer ){
					console.log( 'buildZoomer is true' );
					if( $scope.isVisible() ){
							console.log( 'zoomer is visible, calling buildZoomer' );
						$scope.buildZoomer();
					}
				}

			};

			$scope.buildZoomer = function(){

				console.log( 'in buildZoomer' );

				$scope.imageLayers = L.featureGroup();

				// Build zoomer and store instance in scope
				$scope.zoomer = Zoomer.zoom_image({
					container: $scope.container_id,
					tileURL: $scope.tilesURL,
					imageWidth: $scope.tileData.width,
					imageHeight: $scope.tileData.height
				});

				$scope.zoomer.map._zoomAnimated = false;

				// Add feature group to zoomer
				$scope.zoomer.map.addLayer( $scope.imageLayers );

				_this.loadImageAreas();

				if( $scope.hasAnnotations ) {

					_this.addDrawingControls();

					_this.watchForExternalDeletion();

				}
			};


			/**
			 * Destroy zoomer
			 *
			 * If 'destroyData' is false, the zoomer object and map are destroyed, but
			 * the data in the model is unaffected.
			 */
			this.destroyZoomer = $scope.destroyZoomer = function( destroyData ) {

				if( 'undefined' === typeof destroyData ){
					destroyData = false;
				}

				if( ! $scope.zoomer ) {
					return;
				}

				$scope.zoomer.map.remove();
				delete $scope.zoomer;
				delete Zoomer.zoomers[ $scope.container_id ];
				
				if( destroyData ){
					$element.find( '.griot-zoomer' ).empty();
					$scope.imageID = null;
					$scope.model.annotations = [];

					// Unnecessary and throws an error on image ID change.
					// watchForExternalDeletion will take care of removing image layers.
					//$scope.imageLayers = null;
				}

			};


			/**
			 * Load previously saved image areas
			 */
			this.loadImageAreas = function() {

				angular.forEach( this.getAnnotations(), function( annotation ) {

					// Grab geoJSON stored in annotation
					var geoJSON = annotation.geoJSON;

		    	// Convert geoJSON to layer
		    	var layer = L.GeoJSON.geometryToLayer( geoJSON.geometry );

		    	// Store annotation in layer
					layer.annotation = annotation;

					// Add to local image layers collection
					$scope.imageLayers.addLayer( layer );

				});

			};


			/**
			 * Create drawing control object and append to zoomer
			 */
			this.addDrawingControls = function() {

				var drawControl = new L.Control.Draw({

		      draw: {
		        circle: false,
		        polyline: false,
		        marker: false,
		        rectangle: {
		        	shapeOptions: {
		        		color: '#eee'
		        	}
		       	}
		      },
		      edit: {
		      	featureGroup: $scope.imageLayers
		      }

		    });

		    $scope.zoomer.map.addControl( drawControl );

			};


			/**
			 * If a user deletes an annotation using the repeater, remove the layer 
			 * from the zoomer.
			 */
			this.watchForExternalDeletion = function() {

				$scope.$watchCollection(

					function() {

						return _this.getAnnotations();

					},
					function() {

						if( 'undefined' === typeof $scope.zoomer ) {
							return;
						}

						angular.forEach( $scope.imageLayers._layers, function( layer ) {

							if( -1 === jQuery.inArray( layer.annotation, _this.getAnnotations() ) ) {

								$scope.imageLayers.removeLayer( layer );

							}

						});

					}

				);

			};


			/**
			 * Retrieve the zoomer instance
			 */
			this.getZoomer = function() {
				return $scope.zoomer ? $scope.zoomer : null; 
			};


			/**
			 * Retrieve the reference to the annotations repeater
			 */
			this.getAnnotations = function() {
				return $scope.model[ $attrs.annotationsName ];
			};

			$scope.zoomOut = function() {
				if( 'undefined' !== typeof $scope.zoomer.map ) {
					$scope.zoomer.map.centerImageAtExtents();
				}
			};

			$scope.hasMap = function() {
				if( $scope.zoomer ) {
					return true;
				} else {
					return false;
				}
			};

			this.getScope = function() {
				return $scope;
			};

			this.getImageLayers = function() {
				return $scope.imageLayers;
			};

			$scope.isVisible = function() {

				var visible = true;

				// Walk up the parents - abort if a parent is a swiper slide that is not active
				$element.parents().each( function( i, el ){
					if( $(el).hasClass( 'griot-repeater-item' ) && ! $(el).hasClass( 'swiper-slide-active' ) ){
						visible = false;
					}
				});

				return visible;
			};

		},
		link: function( scope, elem, attrs ) {

			ModelChain.updateModel( scope, attrs.name );

			scope.hasAnnotations = attrs.hasAnnotations;

			// Get reference to image id
			scope.imageID = scope.model[ attrs.name ];

			// Set up zoomers
			scope.checkForTiles();

			elem.find('.griot-zoomer').droppable({
				
				over: function(e, ui){

					// Same image; do nothing
					if( ui.helper.data('image-id') == scope.model[ attrs.name ] ){
						return;
					}

					if( scope.isVisible() ){
						scope.$apply( function(){
							scope.isDroppable = true;
						});
					}
				},
				out: function(){
					scope.$apply( function(){
						scope.isDroppable = false;
					});
				},
				drop: function(e, ui){

					// Ignore hidden zoomers
					if( ! scope.isVisible() ){
						return;
					}

					// Same image; do nothing
					if( ui.helper.data('image-id') == scope.model[ attrs.name ] ){
						return;
					}

					scope.$apply( function(){

						// Unhighlight
						scope.isDroppable = false;

						// Double check with user if there are annotations that will be destroyed
						if( scope.hasAnnotations && scope.model.annotations.length && ! confirm( 'This will destroy the ' + scope.model.annotations.length + ' annotations attached to this view. Proceed?' ) ){
							return;
						}

						scope.model[ attrs.name ] = ui.helper.data('image-id');
						scope.checkForTiles();

					});
				}
			});

			scope.$on( 'slidesReady', function(){
				if( scope.isVisible() ){
					setTimeout( function(){
						if( 'undefined' === typeof scope.zoomer ){
							scope.buildZoomer();
						}
					}, 500 );
				}
			});

			scope.$on( 'slideChange', function(){
				if( 'undefined' !== typeof scope.zoomer ){
					scope.destroyZoomer( false );
				}

				if( scope.isVisible() && 'undefined' === typeof scope.zoomer ){
					scope.buildZoomer();
				}				
			});

		}

	};

});


/**
 * Extend Leaflet
 */
L.extend( L.LatLngBounds.prototype, {

  toGeoJSON: function() {

    L.Polygon.prototype.toGeoJSON.call( this );

  },

  getLatLngs: function() {

    L.Polygon.prototype._convertLatLngs([
      [this.getSouthWest().lat, this.getSouthWest().lng],
      [this.getNorthWest().lat, this.getNorthWest().lng],
      [this.getNorthEast().lat, this.getNorthEast().lng],
      [this.getSouthEast().lat, this.getSouthEast().lng]
    ]);

  }

});