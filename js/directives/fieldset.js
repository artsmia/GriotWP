/**
 * <fieldset> directive
 * 
 * Renders fields from template
 */
angular.module( 'griot' ).directive( 'fieldset', function() {

	return{

		restrict: 'E',
		replace: true,
		templateUrl: function() {
			return griotData.templateUrl;
		}

	}

});