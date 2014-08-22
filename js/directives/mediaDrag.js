/**
 * mediaDrag="" directive
 *
 * Controls dragging of media.
 */
angular.module( 'griot' ).directive( 'mediaDrag', function(){

	return function( scope, elem, attrs ){
		elem.draggable({
			helper:'clone',
			scroll:false,
			revert:'invalid',
			revertDuration:300
		});
	};

});