/**
 * <zoomer> directive
 *
 * Sets up a (non-isolate) scope and controller and prints fields needed to
 * add and annotate zoomable images.
 */
angular.module( 'griot' ).directive( 'objectselector', function( ModelChain ) {

	return {

		restrict: 'E',
		replace:true,
		template: function( elem, attrs ) {
			var templateHtml = "<div class='griot-object-selector'>" +
				"<div class='griot-object-selector-thumb' ng-class='{empty: isEmpty, isDroppable: isDroppable}' ng-style='{ backgroundImage: backgroundImage }'></div>" +
				"<h3 class='griot-object-selector-title'>{{objectTitle}}</h3>" +
			"</div>";
			return templateHtml;
		},
		controller: function( $scope, $element, $attrs ) {

			var _this = this;

			$scope.isDroppable = false;
			$scope.isEmpty = 'undefined' === typeof $scope.model[ $attrs.name ];
			$scope.objectTitle = '';

			$scope.updateView = function( helper ){
				$scope.objectTitle = helper.data('object-title');
				$scope.backgroundImage = 'url(' + helper.attr( 'src' ) + ')';
				$scope.isEmpty = false;
			};

		},
		link: function( scope, elem, attrs ) {

			ModelChain.updateModel( scope, attrs.name );

			elem.find('.griot-object-selector-thumb').droppable({

				over: function(e, ui){

					// Same object; do nothing
					if( ui.helper.data('object-id') == scope.model[ attrs.name ] ){
						return;
					}

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

					// Same object; do nothing
					/*
					if( ui.helper.data('object-id') == scope.model[ attrs.name ] ){
						return;
					}
					*/

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