/**
 * <zoomer> directive
 *
 * Sets up a (non-isolate) scope and controller and prints fields needed to
 * add and annotate zoomable images.
 */
angular.module( 'griot' ).directive( 'objectselector', function( ModelChain, $compile, $rootScope ) {

	return {

		restrict: 'E',
		replace:true,
		template: function( elem, attrs ) {
			var templateHtml = "<div class='griot-object-selector' ng-class='{isDroppable: isDroppable}'>" +
				"<div class='griot-object-selector-data'>" +
					"<p ng-if='data.id'>{{ui.zoomables[data.id].meta.title}}</p>" +
					"<p ng-if='!data.id'>No object selected</p>" +
					"<table ng-if='data.id' border='0' cellpadding='0' cellspacing='0'>" +
						"<tr><td>Accession No.</td><td>{{ui.zoomables[data.id].meta.accession_number}}</td></tr>" +
						"<tr><td>Object ID</td><td>{{data.id}}</td></tr>" +
						"<tr><td>Artist</td><td>{{ui.zoomables[data.id].meta.artist}}</td></tr>" +
						"<tr><td>Dates</td><td>{{ui.zoomables[data.id].meta.dated}}</td></tr>" +
						"<tr><td>Location</td><td>{{ui.zoomables[data.id].meta.country}}, {{ui.zoomables[data.id].meta.continent}}</td></tr>" +
						"<tr><td>Medium</td><td>{{ui.zoomables[data.id].meta.medium}}</td></tr>" +
						"<tr><td>Thumbnail</td><td><img src='http://api.artsmia.org/images/{{data.id}}/small.jpg'></td></tr>" +
					"</table>" +
				"</div>" +
			"</div>";
			return templateHtml;
		},
		controller: function( $scope, $element, $attrs ) {

			var _this = this;

			if($scope.data.id && $scope.data.thumbnail == undefined) {
				$scope.data.thumbnail = "http://api.artsmia.org/images/"+$scope.data.id+"/large.jpg"
			}
			$scope.isDroppable = false;
			$scope.isEmpty = 'undefined' === typeof $scope.model[ $attrs.name ];
			$scope.backgroundImage = $scope.data.id ? 'url(' + $scope.ui.zoomables[ $scope.model[ $attrs.name ] ].images[0].thumb + ')': '';

			$scope.openMediaDrawer = function(){
				$rootScope.mediaVisible = true;
			};

			$scope.updateThumb = function( helper ){
				$scope.backgroundImage = 'url(' + helper.attr('src') + ')';
			};

			$scope.autoUpdateMeta = function(){
        var artist, 
            culture, 
            country, 
            dated, 
            medium, 
            dimension, 
            creditline, 
            accession_number, 
            trustedDescription;

				artist = $scope.ui.zoomables[$scope.data.id].meta.artist || 'Artist unknown';
        culture = $scope.ui.zoomables[$scope.data.id].meta.culture || '';
        country = $scope.ui.zoomables[$scope.data.id].meta.country || '';
        dated = $scope.ui.zoomables[$scope.data.id].meta.dated || '';
        medium = $scope.ui.zoomables[$scope.data.id].meta.medium || '';
        dimension = $scope.ui.zoomables[$scope.data.id].meta.dimension || '';
        creditline = $scope.ui.zoomables[$scope.data.id].meta.creditline || '';
        accession_number = $scope.ui.zoomables[$scope.data.id].meta.accession_number || '';
        trustedDescription = $scope.ui.zoomables[$scope.data.id].meta.description;

        $scope.data.meta1 = artist + ', ' + ( culture && culture + ', ' ) + country;
        $scope.data.meta2 = dated;
        $scope.data.meta3 = ( medium && medium + "\n" ) + ( dimension && dimension + "\n" ) + ( creditline && creditline + "\n" ) + accession_number;
        $scope.data.thumbnail = "http://api.artsmia.org/images/"+$scope.data.id+"/large.jpg"
			};

			$scope.removeObject = function(){
				$scope.data.id = null;
				if( ( $scope.data.meta1 || $scope.data.meta2 || $scope.data.meta3 ) && confirm( 'Would you like to clear the meta fields as well?' ) ){
					$scope.data.meta1 = $scope.data.meta2 = $scope.data.meta3 = null;
				}
			};

		},
		link: function( scope, elem, attrs ) {

			// Add button
			var addBtn = angular.element( "<a class='griot-button griot-pick-object' ng-disabled='protected' ng-click='openMediaDrawer()' ng-if='!data.id'>Choose object</a>" +
				"<a class='griot-button griot-pick-object' ng-disabled='protected' ng-click='openMediaDrawer()' ng-if='data.id'>Change object</a>" +
				"<a class='griot-button griot-remove-object' ng-disabled='protected' ng-if='data.id' ng-click='removeObject()'>Remove object</a>" );
			var compiled = $compile( addBtn );
			elem.closest( '.griot-field-wrap' ).find( '.griot-field-meta' ).append( addBtn );
			compiled( scope );

			jQuery( elem ).droppable({

				tolerance: 'touch',

				over: function(e, ui){
					scope.$apply( function(){
						scope.isDroppable = true;
					});
				},
				out: function(){
					scope.$apply( function(){
						scope.isDroppable = false;
					});
				},
				drop: function(e, ui){

					scope.$apply( function(){

						var oldID = scope.data.id;

						// Unhighlight
						scope.isDroppable = false;

						// Update
						scope.model[ attrs.name ] = ui.helper.data('object-id').toString();
						scope.updateThumb( ui.helper );

					});
				}
			});
		}
	};
});
