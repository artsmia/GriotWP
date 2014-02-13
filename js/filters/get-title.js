/**
 * getTitle filter
 *
 * For use in defining relationships between records. Returns the title if one
 * is set, otherwise 'Untitled (post #{ID})'
 */
angular.module( 'griot' ).filter( 'getTitle', function() {

  return function( record ) {

    return record.post_title === '' ? 'Untitled (post #' + record.ID + ')' : record.post_title;

  };

});