var standardCarousel = (function(){
	'use strict';


	//==========================================
    // INTERAÇÃO ENTRE CADA SECTION "BANNER"
    //==========================================

	var eachSection = function ( event ){
		var getcomponentId = $( this ).attr( 'data-number-component' ),
			getComponent   = $( this ).attr( 'data-componente' );


		//=====================
	    // SELECTORS
	    //=====================

		var Selectors = {
			indexDot       : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"].init-carousel .dots-custom .owl-dot.active',
	    	itemBullet     : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"].init-carousel .bullets .number',
			targetInit     : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"].init-carousel .owl-carousel',
			targetColor    : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"] .owl-item.active .item',
			targetColorOff : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"] .owl-carousel .item',
	    	fluidContainer : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"] .container-fluid.'+getComponent,
	    	component      : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"].init-carousel',
	    	verifyEnable   : '[data-componente="'+getComponent+'"][data-number-component="'+getcomponentId+'"]'
		};


		//=====================
	    // CARROSSEL PROPERTS
	    //=====================

	    var properts = {
	    	autoplay : $( Selectors.targetInit ).attr( 'data-owl-autoplay' ),
	    	loop     : $( Selectors.targetInit ).attr( 'data-owl-loop' ),
	    	dots     : $( Selectors.targetInit ).attr( 'data-owl-target-dots' )
	    };


		//=====================
	    // ACTIONS EVENTS
	    //=====================

		var changeColor = function(){
			setTimeout( function( dataColor ){
				var getOnOff  = $( Selectors.targetColor )[0] ? Selectors.targetColor : Selectors.targetColorOff;
					dataColor = $( getOnOff ).attr( 'data-color' );

				$( Selectors.fluidContainer ).css({ 'background' : dataColor });
			}, 30 );
		};


		//================================================
	    // EXCLUSIVO PARA COMPONENTE "CARROSSEL TÍTULO"
	    //================================================

		var changeBulletActive = function(){
			var _verifyExist = $( Selectors.indexDot ).index();

			$( Selectors.itemBullet ).removeClass( 'active' ).eq( _verifyExist ).addClass( 'active' );
		};


		//=====================
	    // INICIA CAROUSEL
	    //=====================

		$( Selectors.targetInit ).owlCarousel({
            items: 1,
            margin: 10,
            autoplayHoverPause: true,
			loop: properts.loop === 'true',
            autoplay: properts.autoplay === 'true',
            dotsContainer: properts.dots ? Selectors.component+' .'+properts.dots : '',
			onInitialized: function(){
                changeColor();
            	(getComponent == 'carrosselTitulo' ? changeBulletActive() : false);
            },
            onTranslate: function(){
                changeColor();
                (getComponent == 'carrosselTitulo' ? changeBulletActive() : false);
            },
			onDragged: function(){
				changeColor();
				(getComponent == 'carrosselTitulo' ? changeBulletActive() : false);
			}
		});


		//=====================
	    // HELPERS
	    //=====================

		var eventChangeBullet = function(){
			$( Selectors.targetInit ).trigger( 'to.owl.carousel', [ $(this).index(), 300 ] );

			return false;
		};


		function verifyOnOff(){
			if( !$( Selectors.verifyEnable ).hasClass( 'init-carousel' ) ){
				changeColor();
			}
		}

		verifyOnOff()

		//=====================
	    // EVENTS
	    //=====================

		$document.on( 'click', Selectors.itemBullet, eventChangeBullet );
	}


	//=====================
    // CADA CARROSSEL
    //=====================

	var executeEachSection = function(){
		$( '[data-require="carrosselPadrao"]' ).each( eachSection )
	};


	//============
    // EXPORTS
    //============

	return {
		init: executeEachSection
	};
}(jQuery));

standardCarousel.init();
