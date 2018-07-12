var ZigzagLinear = ( function(){
	
	'use strict';

	//=====================
	// SELECTORS
	//=====================

	var selectors = {
		container: '[data-require="zigZagEqualize"]',
		containerCarousel: '[data-swipe="zigzag-linear"]'
	}


	//=====================
	// VARS
	//=====================

	var larguraTela = $( window ).outerWidth();


	//=====================
	// START CAROUSEL
	//=====================

	function createCarousel( targetClass ){
		$( '.owl-carousel.item-'+targetClass ).owlCarousel({
			margin: 10,
			loop: false,
			stagePadding: 30,
			responsiveClass: true,
			nav: true,
			navText  : ['<i class="fa fa-angle-left" aria-hidden="true" data-change-image="prev"></i>','<i class="fa fa-angle-right" aria-hidden="true" data-change-image="next"></i>'],
			responsive: {
				0:{
					items:1,
					mouseDrag: true,
					stagePadding: 0
				},
				600:{
					items:2,
					mouseDrag: true,
					stagePadding: 0
				},
				1025:{
					mouseDrag: true,
					items:4,
					nav: true,
					loop: false,
					stagePadding: 0
				}
			}
		});
	}


	//=====================
	// DESTROY CARROSSEL
	//=====================

	function removeCarousel( targetClass ){

		if( targetClass != undefined ){
			$( '.owl-carousel.item-'+targetClass ).trigger('destroy.owl.carousel');
		}
		else{
			$( '.chamada-zigzag-linear .owl-carousel' ).trigger('destroy.owl.carousel');
			$( selectors.containerCarousel ).removeClass('owl-carousel owl-loaded owl-drag');
		}			
	}


    return {
    	selectors      : selectors,
    	createCarousel : createCarousel,
    	removeCarousel : removeCarousel
    };
}(jQuery));
