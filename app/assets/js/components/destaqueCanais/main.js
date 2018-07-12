var DestaqueCanais = (function() {

    'use strict';
    

    var Selectors = {
        targetInit   : '[data-require="destaqueCanais"] .carrossel-canais'
    }


    function initCarousel() {
        $( Selectors.targetInit ).addClass('owl-carousel');
        
        $( Selectors.targetInit ).owlCarousel({
            loop: true,
            items: 1,
            margin: 10,
            pagination: true,
            nav: false,
            autoHeight: false,
            autoplay: true,
            autoplayTimeout: 7000,
            autoplayHoverPause: true
        })        
    }

    
    return {
        initCarousel : initCarousel
    };


}(jQuery));

DestaqueCanais.initCarousel();

 