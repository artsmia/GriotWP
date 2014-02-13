angular.module( 'griot' ).directive( 'switchgroup', function( $compile, ModelChain ) {
	
	return {

		restrict: 'E',
		replace: true,
		require: '^switch',
		controller: function( $scope, $element, $attrs ) {

			$scope.isCurrentType = function( type ) {

				return type === $scope.model[ $scope.switchName ];

			}

		},
		template: function( elem, attrs ) {

			var transcrude = elem.html();
			var templateHtml = "<div class='griot-switch-item' ng-show='isCurrentType(\"" + attrs.type + "\")'>" + transcrude + "</div>";
			return templateHtml;

		},
		link: function( scope, elem, attrs, switchCtrl ) {

			scope.switchName = switchCtrl.getSwitchName();

			switchCtrl.registerType( attrs.type, attrs.label );

		}

	}

});