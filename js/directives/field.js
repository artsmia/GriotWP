/**
 * <field> directive
 * 
 * Renders individual <field> elements into container, label, and input and 
 * populates ng-model attributes.
 */
angular.module( 'griot' ).directive( 'field', function() {

	return {

		restrict: 'E',
		replace: true,
		scope: {
			data:'=',
			ui:'='
		},
		controller: function( $scope, $element, $attrs, ModelChain ) {

			ModelChain.updateModel( $scope, $attrs.name );

			$scope.protected = $attrs.hasOwnProperty( 'protected' ) ? true : false;

			$scope.toggleProtection = function() {

				$scope.protected = ! $scope.protected;

			}

		},
		template: function( elem, attrs ) {

			var fieldhtml;

			switch( attrs.type ){

				case 'text':
					fieldhtml = "<input type='text' ng-model='model." + attrs.name + "' ng-disabled='protected' />";
					break;

				case 'textarea':
					fieldhtml = "<textarea ng-model='model." + attrs.name + "' ng-disabled='protected' ></textarea>";
					break;

				case 'wysiwyg':
					fieldhtml = "<textarea ng-model='model." + attrs.name + "' ck-editor ng-disabled='protected' ></textarea>";
					break;

				case 'relationship':
					fieldhtml = "<select ng-model='model." + attrs.name + "' ng-options='record.ID as ( record | getTitle ) for record in ui.recordList[ ui.oppositeRecordType ]' multiple ng-disabled='protected' ></select>";
					break;

				case 'image':
					fieldhtml = "<imagepicker name='" + attrs.name + "' />";
					break;

				case 'custom':
					fieldhtml = elem.contents();
					break;

			}

			var templatehtml = "<div class='griot-field-wrap' ng-class='{ \"griot-protected\": protected}' data='data' ui='ui' >" +
				"<div class='griot-field-meta'>";

			// Add label if specified
			if( attrs.hasOwnProperty( 'label' ) ) {

				templatehtml += "<span class='griot-label'>" + attrs.label + "</span>";

			}

			// Add lock/unlock control if specified
			if( attrs.hasOwnProperty( 'protected' ) ) {

				templatehtml += "<a class='griot-button' ng-if='protected' ng-click='toggleProtection()'>Unlock</a>" +
					"<a class='griot-button' ng-if='!protected' ng-click='toggleProtection()'>Lock</a>";

			}

			templatehtml += "</div>" +
				"<div class='griot-field'>" +
					fieldhtml +
				"</div>" +
			"</div>";

			return templatehtml;

		}

	};

});