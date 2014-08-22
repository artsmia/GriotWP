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
			var templateHtml = "<div class='griot-object-selector'>" +
				"<div class='griot-object-selector-thumb' ng-class='{empty: isEmpty, isDroppable: isDroppable}' ng-style='{ backgroundImage: backgroundImage }'></div>" +
				"<h2 class='griot-object-selector-title'>{{objectTitle}}</h2><br />" +
				"<h3 class='griot-object-selector-id'>ID: {{objectID}}</h3>" +
			"</div>";
			return templateHtml;
		},
		controller: function( $scope, $element, $attrs ) {

			var _this = this;

			$scope.isDroppable = false;
			$scope.isEmpty = 'undefined' === typeof $scope.model[ $attrs.name ];
			$scope.objectTitle = '';
			$scope.objectID = $scope.model[ $attrs.name ];

			$scope.updateView = function( helper ){
				$scope.objectTitle = helper.data('object-title');
				$scope.objectID = helper.data('object-id');
				$scope.backgroundImage = 'url(' + helper.attr( 'src' ) + ')';
				$scope.isEmpty = false;
			};

			$scope.openMediaDrawer = function(){
				$rootScope.mediaVisible = true;
			};

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

					// Same object; do nothing
					if( ui.helper.data('object-id') == scope.model[ attrs.name ] ){
						return;
					}

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

					// Same object; do nothing
					if( ui.helper.data('object-id') == scope.model[ attrs.name ] ){
						return;
					}

					scope.$apply( function(){

						// Unhighlight
						scope.isDroppable = false;

						// Update
						scope.model[ attrs.name ] = ui.helper.data('object-id').toString();

						// Update VIEW (hacky - should just listen to model - will fix once
						// remote config matches dev config)
						scope.updateView( ui.helper );

					});
				}
			});
		}
	};
});