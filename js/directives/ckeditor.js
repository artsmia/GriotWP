/**
 * ckeditor="" directive
 * 
 * Renders CKEditor on WYSIWYG fields and keeps model updated (CKEditor 
 * doesn't update textarea natively)
 *
 * See: http://stackoverflow.com/questions/11997246/bind-ckeditor-value-to-model-text-in-angularjs-and-rails
 */
angular.module( 'griot' ).directive( 'ckEditor', function() {

  return {

  	restrict: 'A',
    require: ['?^repeater', '?ngModel'],
    link: function( scope, elem, attrs, ctrls ) {

    	// Define controllers
    	var repeater = ctrls[0];
    	var ngModel = ctrls[1];

    	// Apply CKEditor
      var ck = CKEDITOR.replace( elem[0] );

      if( repeater ) {

      	// If within a repeater, reset size once wysiwyg is rendered
      	ck.on( 'instanceReady', function() {

      		repeater.refresh();

      	});

      }

      /*
      if( !ngModel ) {
      	return;
      }
      */

      // Load CKEditor value into ng-model/textarea 
      ck.on( 'pasteState', function() {

        scope.$apply( function() {

          ngModel.$setViewValue( ck.getData() );

        });

      });

      // Load ng-model/textarea value into CKEditor
      ngModel.$render = function( value ) {

        ck.setData( ngModel.$viewValue );

      };

      // Update readonly (i.e. disabled) value when protected status changes
      if( attrs.hasOwnProperty( 'protected' ) ) {

	      ck.on( 'instanceReady', function() {

		      scope.$watch( 'protected', function( value ) {

		      	ck.setReadOnly( value );
		      	
		      });

	      });

	    }

  	}
	
	};

});