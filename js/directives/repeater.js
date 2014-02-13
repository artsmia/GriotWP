/**
 * <repeater> directive
 *
 * Renders repeaters and provides an API for manipulating each repeater's
 * underlying Swiper object (which is stored in the local scope). Most of
 * these methods are internal, but some may be called from other directives.
 */
angular.module( 'griot' ).directive( 'repeater', function( $timeout ) {

	return {

		restrict: 'E',
		replace: true,
		scope: {
			data:'=',
			ui:'='
		},
		transclude: true,
		controller: function( $scope, $element, $attrs, $timeout, ModelChain ) {

			// Update model chain properties
			ModelChain.updateModel( $scope, $attrs.name );

			// Visibility of repeater item menu
			$scope.showMenu = false;

			// Status of repeater nav options
			$scope.prevDisabled = true;
			$scope.nextDisabled = true;

			$scope.initializing = true;


			/**
			 * Register an empty repeater array in main data object
			 */ 
			$scope.register = function( repeaterName ) {

				if( ! $scope.model.hasOwnProperty( repeaterName ) ) {

					$scope.model[ repeaterName ] = [];

				}

			};


			/**
			 * Create Swiper instance and add to local scope
			 */
			$scope.build = function( repeaterElement ) {

				var repeater = repeaterElement.find( '.swiper-container' ).first().swiper({
					calculateHeight: true,
					pagination: repeaterElement.find( '.griot-repeater-pagination' ).first()[0],
					paginationClickable: true,
					paginationElementClass: 'griot-repeater-bullet',
					paginationActiveClass: 'active',
					onSlideChangeStart: function(){
    				$scope.refreshNav();
  				},
  				noSwiping: true,
  				noSwipingClass: 'griot-prevent-swipe'
				});

				$scope.repeater = repeater;

			};


			/**
			 * Keep repeater nav in sync with repeater position
			 */
			$scope.refreshNav = function() {
				
				// Test ability to regress
				if( $scope.repeater.activeIndex === 0 ) {

					$timeout( function() {
						$scope.prevDisabled = true;
					});

				} else {

					$timeout( function() {
						$scope.prevDisabled = false;
					});

				}

				// Test ability to advance
				if( $scope.repeater.activeIndex === $scope.repeater.slides.length - 1 ) {

					$timeout( function() {
						$scope.nextDisabled = true;
					});

				} else {

					$timeout( function() {
						$scope.nextDisabled = false;
					});

				}

			};


			/** 
			 * Reinitialize (and redraw) Swiper instance
			 */
			$scope.refresh = function() {

				$timeout( function() {

					var oldLength = $scope.repeater.slides.length;

					$scope.repeater.reInit();

					var newLength = $scope.repeater.slides.length;

					if( newLength > oldLength && ! $scope.initializing ) {

						$scope.repeater.swipeTo( newLength - 1 );

					} else {

						$scope.repeater.swipeTo( $scope.repeater.activeIndex );

					}

					$scope.refreshNav();

				});

			};


			/**
			 * Add an item to a repeater
			 */
			$scope.add = function( repeaterModel ) {

				$scope.showMenu = false;

				repeaterModel.push( {} );

			};


			/**
			 * Remove an item from a repeater
			 */
			$scope.remove = function( repeaterModel, itemIndex ) {

				$scope.showMenu = false;

				repeaterModel.splice( itemIndex, 1 );

			};


			/**
			 * Rearrange repeater items
			 */
			$scope.rearrange = function( repeaterModel, currentItemIndex, newItemIndex ) {

				repeaterModel.splice( newItemIndex, 0, repeaterModel.splice( currentItemIndex, 1)[0] );

				$timeout( function(){ 
					$scope.repeater.swipeTo( newItemIndex );
				});

			};


			/**
			 * Toggle the repeater menu
			 */
			$scope.toggleMenu = function() {

				$scope.showMenu = !$scope.showMenu;

			};


			/**
			 * Slide to active index
			 */
			$scope.swipeToActive = function() {

				$timeout( function() {

					$scope.repeater.swipeTo( $scope.repeater.activeIndex );

				});

			};


			/**
			 * Reinitialize (and redraw) Swiper instance (external reference)
			 */
			this.refresh = function() {

				$scope.refresh();

			};


			this.add = function( repeaterModel ) {

				$scope.add( repeaterModel );

			};


			/** 
			 * Advance repeater and set focus on first input element (external)
			 */
			this.nextFocus = function() {

				if( ! $scope.nextDisabled ) {

					$scope.repeater.swipeNext();

					/* Wait for animation to finish before setting focus */
					setTimeout( function() {
						jQuery( $scope.repeater.slides[ $scope.repeater.activeIndex ] ).find( 'input,textarea' ).first().focus();
					}, $scope.repeater.params.speed + 10 );

				}

			};


			/** 
			 * Regress repeater and set focus on last input element (external)
			 */
			this.prevFocus = function() { 

				if( ! $scope.prevDisabled ) {

					$scope.repeater.swipePrev();

					/* Wait for animation to finish before setting focus */
					setTimeout( function() {
						jQuery( $scope.repeater.slides[ $scope.repeater.activeIndex ] ).find( 'input,textarea' ).last().focus();
					}, $scope.repeater.params.speed + 10 );

				}

			};


			/** 
			 * Expose nav status (external)
			 */
			this.nextDisabled = function() {

				return $scope.nextDisabled;

			};
			this.prevDisabled = function() {

				return $scope.prevDisabled;

			};


			/**
			 * Expose active index (exernal)
			 */
			this.getActiveIndex = function() {

				return $scope.repeater.activeIndex;

			};


			/**
			 * Expose repeater object
			 */
			this.getRepeater = function() {
				return $scope.repeater;
			};


			/**
			 * Swipe to
			 */
			this.swipeTo = function( index ) {
				$timeout( function() {
					$scope.repeater.swipeTo( index );
				});
			};

			this.stopInitializing = function() {
				$scope.initializing = false;
			}

		},
		template: function( elem, attrs ) {

			return "<div class='griot-field-wrap' data='data' ui='ui'>" +
				"<p class='griot-field-meta'><span class='griot-label'>" + attrs.label + "</span> <a class='griot-button' ng-click='add( model." + attrs.name + ", \"" + attrs.name + "\" )' >Add " + attrs.labelSingular + "</a></p>" +
				"<div class='griot-repeater'>" +
					"<div class='griot-repeater-header' ng-show='repeater.slides.length !== 0'>" +
						"<div class='griot-repeater-pagination'></div>" +
						"<span class='griot-repeater-nav griot-icon griot-icon-prev prev' ng-click='repeater.swipePrev()' ng-class=\"{'disabled':prevDisabled}\"></span>" +
						"<span class='griot-repeater-nav griot-icon griot-icon-next next' ng-click='repeater.swipeNext()' ng-class=\"{'disabled':nextDisabled}\"></span>" +
					"</div>" +
					"<div class='griot-repeater-container swiper-container'>" +
						"<div class='griot-repeater-wrapper swiper-wrapper'>" +
							"<div class='griot-repeater-item swiper-slide' ng-repeat='elem in model." + attrs.name + "'>" +
								"<div class='griot-repeater-meta-wrap'>"+
									"<span class='griot-repeater-meta'>" + attrs.labelSingular + "&nbsp;&nbsp;{{$index + 1}}&nbsp;&nbsp;of&nbsp;&nbsp;{{repeater.slides.length}}</span>" +
									"<a class='griot-repeater-menu-toggle griot-icon griot-icon-menu' ng-click='toggleMenu()' ng-class='{active:showMenu}'></a>" +
									"<div class='griot-repeater-menu' ng-show='showMenu'>" +
										"<div class='griot-repeater-menu-option'>" +
											"<a class='griot-repeater-menu-option-icon griot-icon griot-icon-delete' ng-click='remove(model." + attrs.name + ", $index)'></a>" +
											"<a class='griot-repeater-menu-option-label' ng-click='remove(model." + attrs.name + ", $index)'>Delete " + attrs.labelSingular + "</a>" +
										"</div>" +											
										"<div class='griot-repeater-menu-option' ng-class='{disabled:$index === 0}'>" +
											"<a class='griot-repeater-menu-option-icon griot-icon griot-icon-shiftleft' ng-click='rearrange(model." + attrs.name + ", $index, $index - 1)'></a>" +
											"<a class='griot-repeater-menu-option-label' ng-click='rearrange(model." + attrs.name + ", $index, $index - 1)'>Shift left</a>" +
										"</div>" +
										"<div class='griot-repeater-menu-option' ng-class='{disabled:$index === repeater.slides.length - 1}'>" +
											"<a class='griot-repeater-menu-option-icon griot-icon griot-icon-shiftright' ng-click='rearrange(model." + attrs.name + ", $index, $index + 1)'></a>" +
											"<a class='griot-repeater-menu-option-label' ng-click='rearrange(model." + attrs.name + ", $index, $index + 1)'>Shift right</a>" +
										"</div>" +
									"</div>" +
								"</div>" +
								"<div class='griot-repeater-fields' ng-transclude></div>" +
							"</div>"+
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>"; 

		},
		link: function( scope, elem, attrs ) {

			var _this = this;
			
			// Register repeater array in main data object
			scope.register( attrs.name );

			// Build repeater
			scope.build( elem );

			// Initialize nav
			scope.refreshNav();

			// Close menu on click outside of element
			jQuery( window ).on( 'click', function( e ) {

				var thisMenu = elem.find( '.griot-repeater-meta-wrap' );

				if( ! jQuery( e.target ).closest( '.griot-repeater-meta-wrap' ).is( thisMenu ) ) {

					scope.$apply(
						scope.showMenu = false
					);

				}

			});

			// Watch for external changes to data object and apply
			scope.$watchCollection( 

				function() {
					return scope.model[ attrs.name ];
				},
				function() {

					// Wait 10ms in case this is part of a batch delete
					window.clearTimeout( _this.checkModel );
					_this.checkModel = window.setTimeout( function(){

						scope.refresh();

					}, 10 );

				}

			);

		}

	};

});