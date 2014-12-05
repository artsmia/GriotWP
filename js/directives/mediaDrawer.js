/**
 * mediaDrawer="" directive
 *
 * Controls drawer for searching and filtering media for zoomers.
 */
angular.module( 'griot' ).directive( 'mediaDrawer', function( $http, $rootScope ) {

	return {

		restrict: 'A',
		replace: true,
		template: "<div class='griot-media-drawer' ng-class=\"{'visible':$root.mediaVisible}\">" +
			"<a class='griot-media-toggle' ng-click='toggle()'></a>" +
			"<div class='griot-media-controls'>" +
				"<h2 class='griot-media-header'>Available Media</h2>" +
				"<p class='griot-media-instructions'>Drag to the left panel to insert.</p>" +
				"<input class='griot-media-search' type='text' ng-model='mediaSearch' id='griot-media-search' placeholder='Search media' />" +
				"<input class='griot-media-filter-by-object' type='checkbox' ng-model='filterByObject' id='griot-media-filter-by-object' />" +
				"<label class='griot-media-label' for='griot-media-filter-by-object'>Current object media only</label>" +
			"</div>" +
			"<div class='griot-media-window'>" +
				"<div class='griot-media-thumb' ng-repeat='image in filteredMedia = (ui.media | filterMediaByObject:filterByObject:data.id | filter:mediaSearch | limitTo:quantity)' >" +
					"<img class='griot-media-image' ng-src='{{image.thumb}}' data-object-id='{{image.object_id}}' data-image-id='{{image.id}}' data-object-title='{{image.object_title}}' data-image-approved='{{image.approved}}' media-drag />" +
				"</div>" +
				"<p ng-hide='filteredMedia.length'>No results. <a ng-click='toggleCurrentMediaFilter()' ng-if='filterByObject'>Try un-checking 'Current object media only'.</p>" +
			"</div>" +
		"</div>",
		controller: function( $scope, $element, $attrs ){

			if($scope.data.id) $scope.filterByObject = true
			// Show this many images at once
			$scope.quantity = 100;

			$rootScope.mediaVisible = false;
			$scope.toggle = function(){
				$rootScope.mediaVisible = ! $rootScope.mediaVisible;
			};
			$scope.toggleCurrentMediaFilter = function() {
				$scope.filterByObject = !$scope.filterByObject
			}
		},
		link: function( scope, elem, attrs ) {
		}
	};

});
