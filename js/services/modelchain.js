/**
 * ModelChain service
 *
 * Tells nested fields and repeaters where in the $scope.data object to store
 * their data.
 * 
 * The 'modelChain' and 'model' parameters are stored in each directive's
 * (isolated) scope and updated based on the parent scope's value. 
 * 
 * modelChain maintains an array representing the chain of elements above the 
 * current field element, i.e. ['data', 'repeater1', '0', 'repeater2', '1', 
 * 'fieldname' ]. model converts modelChain into a reference to the proper
 * storage location in $scope.data. 
 * 
 * NOTE: model in fact resolves to the level just above the field name, so 
 * that the directive template can define ng-model as 'model.fieldname' and 
 * Angular can interpret it correctly. If one were to assign to model a 
 * reference to the actual property (rather than its parent) and elegantly 
 * define ng-model as 'model', Angular would not evaluate the path and would
 * instead bind the field to the property on the LOCAL scope called 'model'.
 * Many Bothans died to bring us this information.
 */
angular.module( 'griot' ).factory( 'ModelChain', function() {

	return {

		/**
		 * Initialize the model chain with 'data' value.
		 * (Called in main controller)
		 */
		initialize: function( scope ) {

			scope.modelChain = ['data'];
			scope.model = scope.data;

		},

		/**
		 * Update modelChain and model and store in local scope. Intended for use
		 * in directives with isolate scope.
		 */
		updateModel: function( scope, name ) {

			// Get parent scope modelChain
			scope.modelChain = angular.copy( scope.$parent.modelChain );

			// Check if this directive is the child of a repeater
			// If so, push repeater item index into model chain
			if( typeof scope.$parent.$index !== "undefined" ) {
				scope.modelChain.push( scope.$parent.$index );
			}

			// NOTE: Technically this returns the local scope, but the directives in
			// which we use this service always define scope.data as referring to
			// the parent scope, all the way to the root, so it works.
			scope.model = scope;

			// Cycle through model chain to create reference to correct location in
			// main data object.
			for( var i = 0; i < scope.modelChain.length; i++ ) {
				scope.model = scope.model[ scope.modelChain[ i ] ];
			}

			// After model has been created (without the field name), add field
			// name to model chain so children receive the complete path.
			scope.modelChain.push( name );

		},

		/**
		 * Get the current model without modifying scope. Intended for use within
		 * directives with non-isolate scope, e.g. annotatedimage directive, so
		 * one can interact with data without polluting the model chain.
		 */
		getModel: function( scope ) {

			// Get parent scope modelChain
			var modelChain = angular.copy( scope.$parent.modelChain );

			// Check if this directive is within a repeater item.
			// If so, push repeater item index into model chain.
			// NOTE: Not checking $parent because non-isolate scope would be shared
			// with repeater item.
			if( typeof scope.$index !== "undefined" ) {
				modelChain.push( scope.$index );
			}

			// Create reference to scope
			var model = scope;

			// Cycle through model chain to create reference to correct location in
			// main data object.
			for( var i = 0; i < modelChain.length; i++ ) {
				model = model[ modelChain[ i ] ];
			}

			return model;

		}

	}

});