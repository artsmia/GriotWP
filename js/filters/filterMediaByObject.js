/**
 * filterMediaByObject filter
 *
 * Filters media by current object ID, if applicable and enabled.
 */
angular.module( 'griot' ).filter( 'filterMediaByObject', function( ModelChain ) {

  return function( media, enabled, objid ) {

		var filtered = [];

  	if( ! enabled ){
  		return media;
  	}

    angular.forEach( media, function(image) {
      if( image.object_id == objid ) {
        filtered.push( image );
      }
    });

    return filtered;

  };
});