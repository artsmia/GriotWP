/**
 * <annotatedimage> directive
 *
 * Sets up a (non-isolate) scope and controller and prints fields needed to
 * add and annotate zoomable images.
 */
angular.module( 'griot' ).directive( 'annotatedimage', function( $http, ModelChain ) {

	return {

		restrict: 'E',
		template: function ( elem, attrs ) {

			// Recursive directives work; recursive transclusion doesn't. But we
			// need to transfer our uncompiled child fields into our repeater for
			// rendering. A workaround ...
			var transcrude = elem.html();

			return "<div class='griot-annotated-image'>" +
				"<field protected label='Image ID' name='" + attrs.name + "' type='text' ng-blur='resetZoom()' />" +
				"<div class='griot-zoomer griot-prevent-swipe' id='zoomer" + Math.floor( Math.random() * 1000000 ) + "-{{$index || 0}}' />" + 
				"<repeater annotations label='Annotations' name='annotations' label-singular='annotation' label-plural='annotations'>" +
					transcrude +
				"</repeater>" +
			"</div>";

		},
		controller: function( $scope, $element, $attrs, ModelChain, $timeout ) {

			// NOTE: Not saving in $scope because scope is shared with arbitrary
			// parents
			var _this = this;

			// Get reference to current position in data object
			this.model = ModelChain.getModel( $scope );

			// Set annotations to empty array if not defined
			if( 'undefined' === typeof this.model[ 'annotations' ] ) { 
				this.model[ 'annotations' ] = [];
			}

			// Get reference to annotations
			this.annotations = this.model[ 'annotations' ];

			// Get reference to image id
			this.imageID = this.model[ $attrs.name ];

			// Get tileJSON base URL
			this.tilejson = griotData.tilejson;


			/**
			 * Check to see if image ID leads to tiles
			 */
			this.checkForTiles = function() {

				// Get new image ID from model
				var newImageID = _this.model[ $attrs.name ];

				// Do nothing if zoomer exists and image ID has not changed
				if( newImageID === _this.imageID && 'undefined' !== typeof _this.zoomer ) {
					return;
				}

				// Return if image ID is blank
				if( ! newImageID ) { 
					_this.destroyZoomer();
					return;
				}

				// Build tile server URL
				// TODO: Pull from settings.
				this.tilejson = 'http://tilesaw.dx.artsmia.org/' + newImageID + '.tif';

				// Get tile data if it exists and build or destroy zoomer accordingly
				var http = $http.get( _this.tilejson );
				http.success( function( tileData ) { 

					_this.buildZoomer( tileData );

				});
				http.error( function() {

					_this.destroyZoomer();

				});

			};


			/**
			 * Build zoomer
			 */
			this.buildZoomer = function( tileData ) {

				_this.imageID = _this.model[ $attrs.name ];

				_this.imageLayers = L.featureGroup();

				// Necessary?
				var tilesURL = tileData.tiles[0].replace( 'http://0', '//0' );

				// Get container ID
				// NOTE: Can't get it on init, because the {{index}} component will 
				// not have been interpolated by Angular yet
				_this.container_id = $element.find( '.griot-zoomer' ).first().attr( 'id' );

				// Build zoomer and store instance in scope
				_this.zoomer = Zoomer.zoom_image({
					container: _this.container_id,
					tileURL: tilesURL,
					imageWidth: tileData.width,
					imageHeight: tileData.height
				});

				_this.zoomer.map._zoomAnimated = false;

				// Add feature group to zoomer
				_this.zoomer.map.addLayer( _this.imageLayers );

				_this.loadImageAreas();

				_this.addDrawingControls();

				_this.watchForExternalDeletion();

			};


			/**
			 * Load previously saved image areas
			 */
			this.loadImageAreas = function() {

				angular.forEach( _this.annotations, function( annotation ) {

					// Grab geoJSON stored in annotation
					var geoJSON = annotation.geoJSON;

		    	// Convert geoJSON to layer
		    	var layer = L.GeoJSON.geometryToLayer( geoJSON.geometry );

		    	// Store annotation in layer
					layer.annotation = annotation;

					// Add to local image layers collection
					_this.imageLayers.addLayer( layer );

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
		      	featureGroup: _this.imageLayers
		      }

		    });

		    _this.zoomer.map.addControl( drawControl );

			};


			/**
			 * If a user deletes an annotation using the repeater, remove the layer 
			 * from the zoomer.
			 */
			this.watchForExternalDeletion = function() {

				$scope.$watchCollection(

					function() {

						return _this.annotations;

					},
					function() {

						if( ! _this.zoomer ) {
							return;
						}

						angular.forEach( _this.imageLayers._layers, function( layer ) {

							if( -1 === jQuery.inArray( layer.annotation, _this.annotations ) ) {

								_this.imageLayers.removeLayer( layer );

							}

						});

					}

				);

			};


			/**
			 * Destroy zoomer
			 */
			this.destroyZoomer = function() {

				if( ! _this.zoomer ) {
					return;
				}

				_this.zoomer.map.remove();
				delete _this.zoomer;
				$element.find( '.griot-zoomer' ).empty();
				_this.imageID = null;
				_this.imageLayers = null;
				delete Zoomer.zoomers[ _this.container_id ];
				
				$timeout( function() {
					_this.model[ 'annotations' ] = [];
				});

			}


			/**
			 * Retrieve the zoomer instance
			 */
			this.getZoomer = function() {
				return _this.zoomer ? _this.zoomer : null; 
			}


			/**
			 * Retrieve the reference to the annotations repeater
			 */
			this.getAnnotations = function() {
				return _this.annotations;
			};

			$scope.zoomOut = function() {
				if( 'undefined' !== typeof _this.zoomer.map ) {
					_this.zoomer.map.centerImageAtExtents();
				}
			};

			$scope.hasMap = function() {
				if( _this.zoomer ) {
					return true;
				} else {
					return false;
				}
			}

			this.getScope = function() {
				return $scope;
			};


			// Watch tiledata and rebuild zoomer when it changes.
			$element.find( '.griot-field-wrap[name=' + $attrs.name + '] input' ).on( 'blur', function() {

				_this.checkForTiles();

			});

			// Initialize if image ID is defined
			_this.checkForTiles();
		
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