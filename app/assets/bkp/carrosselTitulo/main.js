var standardCarousel = (function(){
	'use strict';


    //=====================
    // SELECTORS
    //=====================

    var Selectors = {
    	fluidContainer : '[data-componente="carrosselTitulo"] .container-fluid.carrosselTitulo',
		targetColor    : '[data-componente="carrosselTitulo"] .owl-item.active .item',
		targetInit     : '[data-componente="carrosselTitulo"] .owl-carousel',
    	component      : '[data-componente="carrosselTitulo"]',
    	itemBullet     : '[data-componente="carrosselTitulo"] .bullets.carousel-iniciado .number',
		containerBullet: '[data-componente="carrosselTitulo"] .bullets'
	};


    //=====================
    // EVENTS
    //=====================

	$document.on( 'click', Selectors.itemBullet, eventChangeBullet );


	//=====================
    // CAROUSEL
    //=====================

    function initCarousel(){
		$( Selectors.targetInit ).owlCarousel({
            loop: true,
            items: 1,
            dotsContainer: '.dots-custom',
            margin: 10,
            pagination: false,
            autoplayTimeout: 7000,
            autoplayHoverPause: true,
            onInitialized: function(){
                changeColor()
            	startCarouselTitulo();
            },
            onTranslate: function(){
                changeColor()
                verifyCarouselTitulo()
            },
            onDragged: function(){
                changeColor()
            }
		});
	}


	//==================================
    // EXCLUSIVO PARA CARROSSEL TÍTULO
    //==================================

	function startCarouselTitulo(){
		if( Selectors.component ){
			$( Selectors.containerBullet ).addClass( 'carousel-iniciado' );
			changeBulletActive();
		}
	}

	function verifyCarouselTitulo(){
		if( $( Selectors.containerBullet ).hasClass( 'carousel-iniciado' ) ){
			changeBulletActive()
		}
	}

	function changeBulletActive(){
		var _verifyExist = $( '.dots-custom .owl-dot.active' ).index();

		$( Selectors.itemBullet ).removeClass( 'active' ).eq( _verifyExist ).addClass( 'active' );
	}

	function eventChangeBullet(){
		$( Selectors.targetInit ).trigger( 'to.owl.carousel', [ $(this).index(), 300 ] );
	}


	//=====================
    // ACTIONS EVENTS
    //=====================

	function changeColor(){
		setTimeout( function( dataColor ){
			dataColor = $( Selectors.targetColor ).attr( 'data-color' );

			$( Selectors.fluidContainer ).css({ 'background' : dataColor });
		}, 30 );
	}


	//=====================
    // HELPERS
    //=====================

	function startCarousel(){
        initCarousel();
    }


    //============
    // EXPORTS
    //============

    return {
        init: startCarousel
    };
}(jQuery));

standardCarousel.init();
