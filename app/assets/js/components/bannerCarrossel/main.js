var bannerCarouselApp = (function(){
    'use strict';


    //=====================
    // SELECTORS
    //=====================

    var Selectors = {
        fluidContainer : '[data-componente="BannerCarrossel"] .container-fluid.carrossel-preview',
        targetColor    : '[data-componente="BannerCarrossel"] .owl-item.active .item',
        targetInit     : '[data-componente="BannerCarrossel"] .owl-carousel',
        targetDot      : '[data-componente="BannerCarrossel"] .owl-carousel .owl-dots .owl-dot'
    }


    //=====================
    // EVENTS
    //=====================

    $document.on( 'click', Selectors.targetDot, changeColor );


    //=====================
    // CAROUSEL
    //=====================

    function initCarousel(){
        $( Selectors.targetInit ).owlCarousel({
            loop: true,
            items: 1,
            margin: 10,
            dotsData: true,
            pagination: false,
            autoplay: true,
            autoplayTimeout: 7000,
            autoplayHoverPause: true,
            onRefreshed: function(){
                changeColor()
            },
            onTranslate: function(){
                changeColor()
            },
            onDragged: function(){
                changeColor()
            }
        })
    }


    //=====================
    // HELPERS
    //=====================

    // TROCANDO A IMAGEM ATRAVÉS DE EVENTOS (CLICKS, MOUSEOVERS, ETC...), A COR DO BACKGROUND É ALTERADA
    function changeColor(){
		setTimeout( function( dataColor ){
			dataColor = $( Selectors.targetColor ).attr( 'data-color' );

			$( Selectors.fluidContainer ).css({ 'background' : dataColor });
            playVideo();
		}, 30 );
	}

    // FUNÇÕES QUE DEVERÃO SER CARREGADAS AO INICIAR O SCRIPT DO PLUGIN
    function resolution(){
        initCarousel();
    }


    function playVideo() {
        $(Selectors.video).hover(function() {
            $(this).find("video").get(0).play();
        }, function() {
            $(this).find("video").get(0).pause();
            $(this).find("video").get(0).currentTime = 0;
        })
    }

    function resize(){
        var width = $window.width();
        if(width < 650) {
            $('.galeria_mosaico .item .video').each(function() {
                var src = $( this ).attr('data-mobile');
                if(src !== undefined){
                    $(this).find("video").remove();
                    $(this).append("<video loop='loop' muted='muted'><source src='"+ src +"'/></video>");
                }
            });
        }else if(width < 1024){
            $('.galeria_mosaico .item .video').each(function() {
                var src = $( this ).attr('data-tablet');
                if(src !== undefined){
                    $(this).find("video").remove();
                    $(this).append("<video loop='loop' muted='muted'><source src='"+ src +"'/></video>");
                }
            });
        }
        
   }


    //=====================
    // EXPORTS
    //=====================

    return {
        resolution : resolution
    };
}(jQuery));

bannerCarouselApp.resolution();