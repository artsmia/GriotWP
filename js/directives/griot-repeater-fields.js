/**
 * .griot-repeater-fields directive
 *
 * Reinitializes Swiper instance of parent repeater when the last repeater
 * item is printed and when height changes, and controls tabbing behavior
 * between fields in separate repeater items
 */
angular.module( 'griot' ).directive( 'griotRepeaterFields', function( $timeout ) {

	return {

		restrict:'C',
		require:'^repeater',
		link: function( scope, elem, attrs, repeaterCtrl ) {

			var _this = this;

			// Reinitialize Swiper instance when last repeater item is printed
			if( scope.$last ) {

				repeaterCtrl.refresh();

				// ... and turn "initializing" off
				$timeout( function() {
					repeaterCtrl.stopInitializing();
				});

			}

			// Reinitialize Swiper instance when height changes
			scope.$watch( 

				function( ) { 
					return elem.height();
				}, 
				function( newValue, oldValue ) {
					if( newValue != oldValue ) {
						repeaterCtrl.refresh();
					}
				}

			);

			// Intercept tabbing and move destination into view before focusing on 
			// the next field. This prevents repeater items from getting "stuck"
			// halfway in view and helps create a logical tabbing workflow.
			elem.find( 'input,textarea' ).last().on( 'keydown', function( e ) {

				// Tabbing forward from last input of a repeater item
				if( e.keyCode === 9 && e.shiftKey === false && !repeater.nextDisabled() ) {
					repeater.nextFocus();
					return false;
				}

				// Tabbing backward from first input of a repeater item
				if( e.keyCode === 9 && e.shiftKey === true && !repeater.prevDisabled() ) {
					repeater.prevFocus();
					return false;
				}

			});

		}

	}

});