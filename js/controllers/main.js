/**
 * Application controller
 *
 * Initializes data object and scope chain
 */
angular.module( 'griot' ).controller( 'griotCtrl', function( $scope, $http, ModelChain ) { 

	// Initialize model chain
	ModelChain.initialize( $scope );

	// Initialize data object and load previously saved data into model. 
	// See Griot::print_data() in class-griot.php
	$scope.data = griotData.data ? JSON.parse( griotData.data ) : {};
	$scope.data.title = griotData.title;
	$scope.ui = {
		recordType: griotData.recordType,
		oppositeRecordType: griotData.recordType == 'object' ? 'story' : 'object',
		recordList: griotData.recordList,
		tileServer: griotData.tileServer,
		zoomables: griotData.config,
		objects: []
	};

	if( griotData.config ) {

		for( var objectid in griotData.config.objects ) {

			if( 'null' === objectid || '_empty_' === objectid ) {
				continue;
			}

			$scope.ui.objects.push( objectid );

		}

	}
	else {
		console.log( 'WARNING: No config detected!' );
	}

});