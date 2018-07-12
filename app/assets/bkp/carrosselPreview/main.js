var bannerCarouselApp = (function(){
    'use strict';
    

    //=====================
    // SELECTORS
    //=====================

    var Selectors = {
        fluidContainer : '[data-componente="carrosselPreview"] .container-fluid.carrossel-preview',
        targetColor    : '[data-componente="carrosselPreview"] .owl-item.active .item',
        targetInit     : '[data-componente="carrosselPreview"] .owl-carousel',
        component      : '[data-componente="carrosselPreview"]'
    }


    //=====================
    // CAROUSEL
    //=====================
    
    function initCarousel(){
        $( Selectors.targetInit ).owlCarousel({
            loop: true,
            items: 1,
            dotsContainer: '.dots-custo',
            margin: 10,
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
    // ACTIONS EVENTS
    //=====================
    
    function changeColor(){
        setTimeout( function( dataColor ){
            dataColor = $( Selectors.targetColor ).attr( 'data-color' );
            $( Selectors.fluidContainer).css({ 'background' : dataColor });
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

bannerCarouselApp.init();