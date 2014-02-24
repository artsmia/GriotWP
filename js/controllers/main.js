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
		tileServer: griotData.tileServer,
		zoomables: griotData.config.all,
		objects: []
	}
	
	for( var objectid in griotData.config.grouped ) {

		if( 'null' === objectid || '_empty_' === objectid ) {
			continue;
		}

		$scope.ui.objects.push({
			'id':objectid,
			'zoomables':griotData.config.grouped[ objectid ]
		});

	}

	// Initialize model chain
	ModelChain.initialize( $scope );

});