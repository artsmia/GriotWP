/**
 * filterObjects filter
 *
 * Return array of zoomables from specified object, or if not specified, from
 * ui.zoomables master array
 */
angular.module( 'griot' ).filter( 'filterObjects', function() {

  return function( objects, ui, requestedID ) {

  	var chosenObject = null;

  	for( var i = 0; i < objects.length; i++ ) {
  		if( objects[i].id === requestedID ) {
  			chosenObject = objects[i];
  		}
  	}

  	if( chosenObject ) {
  		return chosenObject.zoomables;
  	} else {
  		return ui.zoomables;
  	}

  };

});