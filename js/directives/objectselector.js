/**
 * <zoomer> directive
 *
 * Sets up a (non-isolate) scope and controller and prints fields needed to
 * add and annotate zoomable images.
 */
angular.module( 'griot' ).directive( 'objectselector', function( ModelChain, $compile, $rootScope, $sce ) {

	return {

		restrict: 'E',
		replace:true,
		template: function( elem, attrs ) {
			var templateHtml = "<div class='griot-object-selector'>" +
				"<div class='griot-object-selector-thumb' ng-class='{empty: isEmpty, isDroppable: isDroppable}' ng-style='{ backgroundImage: backgroundImage}'></div>" +
				"<table ng-if='data.id' class='griot-object-selector-data' border='0' cellpadding='0' cellspacing='0'>" +
					"<tr><td>Title</td><td>{{ui.zoomables[data.id].meta.title}}</td></tr>" +
					"<tr><td>Accession No.</td><td>{{ui.zoomables[data.id].meta.accession_number}}</td></tr>" +
					"<tr><td>Object ID</td><td>{{data.id}}</td></tr>" +
					"<tr><td>Artist</td><td>{{ui.zoomables[data.id].meta.artist}}</td></tr>" +
					"<tr><td>Dates</td><td>{{ui.zoomables[data.id].meta.dated}}</td></tr>" +
					"<tr><td>Location</td><td>{{ui.zoomables[data.id].meta.country}}, {{ui.zoomables[data.id].meta.continent}}</td></tr>" +
					"<tr><td>Medium</td><td>{{ui.zoomables[data.id].meta.medium}}</td></tr>" +
				"</table>" +
			"</div>";
			return templateHtml;
		},
		controller: function( $scope, $element, $attrs ) {

			var _this = this;

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
        trustedDescription = $sce.trustAsHtml( $scope.ui.zoomables[$scope.data.id].meta.description );

        $scope.data.meta1 = artist + ', ' + ( culture && culture + ', ' ) + country;
        $scope.data.meta2 = dated;
        $scope.data.meta3 = $sce.trustAsHtml( ( medium && medium + "\n" ) + ( dimension && dimension + "\n" ) + ( creditline && creditline + "\n" ) + accession_number );
			}

		},
		link: function( scope, elem, attrs ) {

			// Add button
			var addBtn = angular.element( "<a class='griot-button griot-pick-object' ng-disabled='protected' ng-click='openMediaDrawer()' ng-if='isEmpty'>Choose object</a>" +
				"<a class='griot-button griot-pick-object' ng-disabled='protected' ng-click='openMediaDrawer()' ng-if='!isEmpty'>Change object</a>" +
				"<a class='griot-button griot-remove-object' ng-disabled='protected' ng-if='hasImage' ng-click='removeObject()'>Remove object</a>" );
			var compiled = $compile( addBtn );
			elem.closest( '.griot-field-wrap' ).find( '.griot-field-meta' ).append( addBtn );
			compiled( scope );

			elem.find('.griot-object-selector-thumb').droppable({

				activate: function(e, ui){

					scope.$apply( function(){
						scope.isDroppable = true;
					});

				},
				deactivate: function(){
					scope.$apply( function(){
						scope.isDroppable = false;
					});
				},
				drop: function(e, ui){

					scope.$apply( function(){

						// Unhighlight
						scope.isDroppable = false;

						// Update
						scope.model[ attrs.name ] = ui.helper.data('object-id').toString();
						scope.updateThumb( ui.helper );

						if( ui.helper.data('object-id') !== scope.model[ attrs.name ] && confirm( 'Auto-update metadata?' ) ){
							scope.autoUpdateMeta();
						}

					});
				}
			});
		}
	};
});