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
				"<field type='zoomerselector' object='" + attrs.object + "' name='" + attrs.name + "' />" +
				"<div class='griot-zoomer griot-prevent-swipe' id='zoomer" + Math.floor( Math.random() * 1000000 ) + "-{{$id}}' ng-class='{ hasAnnotations: hasAnnotations, noAnnotations: !hasAnnotations }' />";

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

			/**
			 * Check to see if image ID leads to tiles
			 */
			$scope.checkForTiles = function() {

				// Get new image ID from model
				var newImageID = $scope.model[ $attrs.name ];

				// Do nothing if zoomer exists and image ID has not changed
				if( newImageID === $scope.imageID && 'undefined' !== typeof $scope.zoomer ) {
					return;
				}

				// Return if image ID is blank
				if( ! newImageID ) { 
					_this.destroyZoomer();
					return;
				}

				// Build tile server URL
				$scope.tilejson = $scope.ui.tileServer + newImageID + '.tif';

				// Get tile data if it exists and build or destroy zoomer accordingly
				var http = $http.get( $scope.tilejson );
				http.success( function( tileData ) { 

					_this.destroyZoomer();
					_this.buildZoomer( tileData );

				});
				http.error( function( e ) {

					_this.destroyZoomer();

				});

			};


			/**
			 * Build zoomer
			 */
			this.buildZoomer = function( tileData ) {

				$scope.imageID = $scope.model[ $attrs.name ];

				$scope.imageLayers = L.featureGroup();

				// Necessary?
				var tilesURL = tileData.tiles[0].replace( 'http://0', '//0' );

				// Get container ID
				// NOTE: Can't get it on init, because the {{index}} component will 
				// not have been interpolated by Angular yet
				$scope.container_id = $element.find( '.griot-zoomer' ).first().attr( 'id' );

				// Build zoomer and store instance in scope
				$scope.zoomer = Zoomer.zoom_image({
					container: $scope.container_id,
					tileURL: tilesURL,
					imageWidth: tileData.width,
					imageHeight: tileData.height
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

						if( ! $scope.zoomer ) {
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
			 * Destroy zoomer
			 */
			this.destroyZoomer = function() {

				if( ! $scope.zoomer ) {
					return;
				}

				$scope.zoomer.map.remove();
				delete $scope.zoomer;
				$element.find( '.griot-zoomer' ).empty();
				$scope.imageID = null;
				$scope.imageLayers = null;
				delete Zoomer.zoomers[ $scope.container_id ];
				
				$timeout( function() {
					$scope.model[ 'annotations' ] = [];
				});

			}


			/**
			 * Retrieve the zoomer instance
			 */
			this.getZoomer = function() {
				return $scope.zoomer ? $scope.zoomer : null; 
			}


			/**
			 * Retrieve the reference to the annotations repeater
			 */
			this.getAnnotations = function() {
				return $scope.model[ $attrs.annotationsName ];;
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

		},
		link: function( scope, elem, attrs ) {

			ModelChain.bypassModel( scope );

			scope.hasAnnotations = attrs.hasAnnotations;

			// Get reference to image id
			scope.imageID = scope.model[ attrs.name ];

			// Initialize
			scope.checkForTiles();

			elem.find( 'select' ).on( 'change', function() {
				scope.checkForTiles();
			});
	

		}

	}

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