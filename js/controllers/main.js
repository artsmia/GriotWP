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
		media: []
	}
	
	// Assemble media
	for( var objid in $scope.ui.zoomables ){
		var meta = $scope.ui.zoomables[ objid ].meta;
		var images = $scope.ui.zoomables[ objid ].images;
		for( var i = 0; i < images.length; i++ ){
			var image = images[i];
			image.object_id = objid;
			image.id = image.file.split('.tif')[0];
			image.thumb = $scope.ui.zoomables[ objid ].images[i].thumb = 'http://tiles.dx.artsmia.org/v2/' + image.file.split('.tif')[0] + '/0/0/0.png';
			image.meta = [ meta.artist, meta.continent, meta.country, meta.creditline, meta.culture, meta.description, meta.medium, meta.title ].join(' ');
			image.object_title = meta.title;
			$scope.ui.media.push( image );
		}
	}

});