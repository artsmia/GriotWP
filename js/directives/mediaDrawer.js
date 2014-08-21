/**
 * mediaDrawer="" directive
 *
 * Controls drawer for searching and filtering media for zoomers.
 */
angular.module( 'griot' ).directive( 'mediaDrawer', function( $http ) {

	return {

		restrict: 'A',
		replace: true,
		template: "<div class='griot-media-drawer' ng-class=\"{'visible':drawerVisible}\" ng-click=''>" +
			"<h2>Available Media</h2>" +
			"<input class='griot-media-search' type='text' ng-model='mediaSearch.meta' id='griot-media-search' placeholder='Search media' />" +
			"<input class='griot-media-filter-by-object' type='checkbox' ng-model='filterByObject' id='griot-media-filter-by-object' />" +
			"<label class='griot-media-label' for='griot-media-filter-by-object'>Current object media only</label>" +
			"<div class='griot-media'>" +
				"<div class='griot-media-thumb' ng-repeat='image in media | filterMediaByObject:filterByObject:data.id | filter:mediaSearch | limitTo:20'>" +
					"<img ng-src='{{image.thumb}}' />" +
				"</div>" +
			"</div>" +
		"</div>",
		controller: function( $scope, $element, $attrs ){

			var devZoomables;

			$scope.drawerVisible = true;
			$scope.media = [];

			/**
			 * Get the dev zoomables (soon to be the config) and arrange into a structure
			 * that we can use in the media drawer.
			 */
			$http.get( 'http://author.loc/wp-content/plugins/GriotWP/tdx_rev.json' )
				.success( function(data){
					devZoomables = data;
				})
				.then( function(){
					for( var objid in devZoomables ){
						var images = devZoomables[ objid ].images;
						var meta = devZoomables[ objid ].meta;
						for( var i = 0; i < images.length; i++ ){
							var image = images[i];
							var filename = image.file.split('.tif');
							image.object_id = objid;
							image.thumb = 'http://tiles.dx.artsmia.org/v2/' + image.file.split('.tif')[0] + '/0/0/0.png';
							image.meta = [ meta.artist, meta.continent, meta.country, meta.creditline, meta.culture, meta.description, meta.medium, meta.title ].join(' ');
							$scope.media.push( image );
						}
					}
				});
		},
		link: function( scope, elem, attrs ) {
		}
	};

});