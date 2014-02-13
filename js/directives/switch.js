angular.module( 'griot' ).directive( 'switch', function( ModelChain ) {
	
	return {

		restrict: 'E',
		replace: true,
		controller: function( $scope, $element, $attrs ) {

			$scope.model = ModelChain.getModel( $scope );

			$scope.model[ $attrs.name ] = $scope.model[ $attrs.name ] ? $scope.model[ $attrs.name ] : $attrs.default;

			$scope.switchers = $scope.hasOwnProperty( 'switchers' ) ? $scope.switchers : {};

			$scope.switchers[ $attrs.name ] = {

				default: $attrs.default,
				types: []

			}

			this.registerType = function( type, label ) {

				if( -1 === $scope.switchers[ $attrs.name ].types.indexOf( type ) ) {
					$scope.switchers[ $attrs.name ].types.push({
						name: type,
						label: label
					});
				}
				console.log( 'Registered ' + type );
				console.log( $scope.switchers[ $attrs.name ].types );

			}

			this.getSwitchName = function() {
				return $attrs.name;
			}

		},
		template: function( elem, attrs ) {

			var transcrude = elem.html();

			var templateHtml = "<div class='griot-switch-wrap'>" +
				"<div class='griot-field-wrap'>" +
					"<div class='griot-field-meta'>" +
						"<span class='griot-label'>" + attrs.label + "</span>" +
						"<select ng-model='model[ \"" + attrs.name + "\" ]' ng-options='type.name as type.label for type in switchers." + attrs.name + ".types'></select>" +
					"</div>" +
				"</div>" +
				transcrude +
			"</div>";

			return templateHtml;

		},
		link: function( scope, elem, attrs ) {



		}

	}

});