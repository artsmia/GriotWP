/**
 * Application controller
 *
 * Initializes data object and scope chain
 */
angular.module( 'griot' ).controller( 'griotCtrl', function( $scope, ModelChain ) { 

	// Initialize data object and load previously saved data into model. 
	// See Griot::print_data() in class-griot.php
	$scope.data = griotData.data ? JSON.parse( griotData.data ) : {};
	$scope.data.title = griotData.title;
	$scope.ui = {
		recordType: griotData.recordType,
		oppositeRecordType: griotData.recordType == 'object' ? 'story' : 'object',
		recordList: griotData.recordList,
	}

	// Initialize model chain
	ModelChain.initialize( $scope );

});