var payPerView = (function() {

    'use strict';
    

    var Selectors = {
        targetInit   : '[data-require="payPerView"] .owl-carousel',
        classWrap : '.list-ppv',
        itemsDestaque: '[data-destaque="true"]',
        itemsCombinacao: '[data-destaque="false"]'
    }



    function createPpvCarousel() {         
        $( Selectors.targetInit ).owlCarousel({
            loop: false,
            stagePadding: 25,
            margin: 10,
            pagination: false,
            nav: false,
            autoHeight: false,
            autoplay: false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                }
            }
        }) 

             
    }


    function combinacao(){
        $(Selectors.itemsDestaque).parent().addClass("highlight");
        $(Selectors.itemsCombinacao).parent().addClass("c-bg");       
    }


    function removePpvCarousel() {       
        $( Selectors.classWrap ).trigger('destroy.owl.carousel');  
    }


    function initPpv() { 

        if( $( window ).width() >= 1000 ) {
            removePpvCarousel();

        }else if( $( window ).width() <= 999 ) {            
            createPpvCarousel();
            combinacao();
        }


        window.addEventListener("orientationchange", function() {
            if( $( window ).width() <= 999 ) {
                createPpvCarousel();
                combinacao();
               
            }else if( $( window ).width() >= 1000 ) {
                removePpvCarousel();
            }
            
        }, false);

        
    }

    
    return {
        initPpv : initPpv
    };


}(jQuery));

payPerView.initPpv();

 