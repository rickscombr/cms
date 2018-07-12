var bannerCapas = (function() {

    'use strict';
    

    var Selectors = {
        targetInit   : '[data-require="bannerCapas"] .owl-carousel',
        bgDesktop: 'data-bg-desktop',
        bgTablet: 'data-bg-tablet',
        bgMobile: 'data-bg-mobile',
        bgCor: 'data-bg',    
        targetColors: '[data-componente="bannerCapas"]'
    }


    function changeBG(){

        $(Selectors.targetColors).each(function(){
            var desktop = $(this).attr(Selectors.bgDesktop);
            var tablet = $(this).attr(Selectors.bgTablet);
            var mobile = $(this).attr(Selectors.bgMobile);
            var corbg = $(this).attr(Selectors.bgCor);
            var windowW = $(window).width();

            $(this).css({'background-size': 'cover', 'background-color': 'corbg'}); 

            if(windowW >= 319 && windowW <= 559){                

                $(this).css({'background-image': 'url(' + mobile + ')'});  

            }else if(windowW >= 650 && windowW <= 1023){
                
                $(this).css({'background-image': 'url(' + tablet + ')'});

            }else if(windowW >= 1024){
                
                $(this).css({'background-image': 'url(' + desktop + ')'});
            }

        });

        window.addEventListener("orientationchange", changeBG);
    
    }


    function initCarousel() {

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

bannerCapas.initCarousel();

 