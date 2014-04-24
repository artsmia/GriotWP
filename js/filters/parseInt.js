/**
 * parseInt filter
 *
 * Parses string as integer
 */
angular.module( 'griot' ).filter( 'parseInt', function() {
 	return function( record ) {
 		return parseInt( record );
 	}
});