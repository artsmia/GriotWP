/**
 * <imagepicker> directive
 *
 * Sets up a (non-isolate) scope and controller and prints fields needed to
 * add and annotate zoomable images.
 */
angular.module( 'griot' ).directive( 'imagepicker', function( $compile ) {

	return{

		restrict: 'E',
		replace: true,
		template: function( elem, attrs ) {

			var templateHtml = "<div class='griot-imagepicker' >";
			
			if( 'external' === griotData.imageSrc ) {

				templateHtml += "<div class='griot-image-chooser' ng-class='{active: angframe.isOpen}'>" +
					"<img class='griot-image-thumbnail' ng-repeat='imageUrl in imageList' ng-src='{{ imageUrl }}' ng-click='angframe.select( imageUrl )' />" +
				"</div>";

			}

			templateHtml += "<div class='griot-current-image' ng-class='{empty: !hasImage }' ng-style='{ backgroundImage: backgroundImage }' ng-click='openFrame()'></div>" +
				"</div>";

			return templateHtml;

		},
		controller: function( $scope, $element, $attrs ) {

    	$scope.hasImage = $scope.model[ $attrs.name ];

			$scope.backgroundImage = $scope.model[ $attrs.name ] ? 'url(' + $scope.model[ $attrs.name ] + ')' : 'auto';

			$scope.isImageTarget = false;

			// If using WordPress image library ...

			$scope.wpmframe = wp.media.griotImageLibrary.frame();

			$scope.wpmframe.on( 'select', function() {

				if( $scope.isImageTarget ) {

					var selection = $scope.wpmframe.state().get( 'selection' );
					selection.each( function( attachment ) {

						if( attachment.attributes.url ) {

							$scope.$apply( function() {
								$scope.model[ $attrs.name ] = attachment.attributes.url;
								$scope.backgroundImage = 'url(' + attachment.attributes.url + ')';
								$scope.isImageTarget = false;
								$scope.hasImage = true;

							});

						}

					});
					
	    	}

    	});

    	// If using Angular image library ... 

    	$scope.imageList = griotData.imageList;

    	$scope.angframe = {

    		isOpen: false,

    		select: function( url ) {

    			if( url ) {

						$scope.model[ $attrs.name ] = url;

						$scope.backgroundImage = 'url(' + url + ')';

						$scope.isImageTarget = false;

						$scope.hasImage = true;

	    		}

	    		$scope.angframe.close();

    		},

    		open: function() {
  				$scope.angframe.isOpen = true;
    		},

    		close: function() {
    			$scope.angframe.isOpen = false;
    		},

    		toggle: function() {
    			$scope.angframe.isOpen = ! $scope.angframe.isOpen;
    		}

    	}

			$scope.openFrame = function() {

				if( $scope.protected ) {
					return;
				}

				if( 'wordpress' === griotData.imageSrc ) {

					$scope.wpmframe.open();

				} else {

					$scope.angframe.toggle();

				}

				$scope.isImageTarget = true;

			}

			$scope.removeImage = function() {

				if( $scope.protected ) {
					return;
				}

				$scope.model[ $attrs.name ] = null;
				$scope.hasImage = false;
				$scope.backgroundImage = 'auto';
				$scope.angframe.close();

			}

		},
		link: function( scope, elem, attrs ) {

			var addImageBtn = angular.element( "<a class='griot-button griot-pick-image' ng-disabled='protected' ng-click='openFrame()' ng-if='!hasImage'>Choose image</a>" +
				"<a class='griot-button griot-pick-image' ng-disabled='protected' ng-click='openFrame()' ng-if='hasImage'>Change image</a>" +
				"<a class='griot-button griot-remove-image' ng-disabled='protected' ng-if='hasImage' ng-click='removeImage()'>Remove image</a>" );
			var compiled = $compile( addImageBtn );
			elem.closest( '.griot-field-wrap' ).find( '.griot-field-meta' ).append( addImageBtn );
			compiled( scope );

		}

	}

});

wp.media.griotImageLibrary = {
     
	frame: function() {
	
		if( this._frame ) {
			return this._frame;
		}

		this._frame = wp.media({
			id:         'griot-library-frame',                
			title:      'Insert an image',
			multiple:   false,
			editing:    true,
			library:    { type: 'image' },
			button:     { text: 'Insert' }
		});

		return this._frame;

	},

}
