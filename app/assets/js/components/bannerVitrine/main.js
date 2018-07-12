var bannerVitrine = (function(){
    'use strict';


    //=====================
    // SELECTORS
    //=====================

    var Selectors = {
        targetInit: '[data-componente="BannerVitrine"] .owl-carousel',
        item: '.banner-vitrine-item',
        itemVideo: '.banner-vitrine-item .video'
    }

    //=====================
    // CAROUSEL
    //=====================

    function initCarousel(){
        $( Selectors.targetInit ).owlCarousel({
            loop: false,
            items: 1,
            pagination: false
        })
    }

    function removeCarousel(){
        $( Selectors.targetInit ).owlCarousel('destroy');
    }

    function setOnHoverVideo() {
        $( Selectors.item ).hover(function() {
            var video = $(this).find("video").get(0);
            if(video !== undefined) {
                video.play();
            }
        }, function() {
            var video = $(this).find("video").get(0);
            if(video !== undefined) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }

    function removeOnHoverVideo() {
        $( Selectors.item ).unbind('mouseenter mouseleave');
    }

    function setSrcVideo(dataSourceAttr) {
        $( Selectors.itemVideo ).each(function() {
            var src = $( this ).attr(dataSourceAttr);
            if(src !== undefined){
                $(this).find('video').remove();
                $(this).append('<video loop="loop" muted="muted"><source src="' + src + '" /></video>');
            }
        });
    }

    function prepareVideo() {
        var width = $window.width();
        if(width < 650){
            setSrcVideo('data-mobile');
        }else if(width < 1024){
            setSrcVideo('data-tablet');
        }
    }

    //=====================
    // HELPERS
    //=====================


    function init(){
        var width = $(window).width();

        if (width <= 634) {
            initCarousel();
        } else {
            removeCarousel();
        }

        if(width >= 1024) {
            setOnHoverVideo();
        } else {
            removeOnHoverVideo();
        }
    }


    //=====================
    // EXPORTS
    //=====================

    return {
        init : init,
        prepareVideo : prepareVideo
    };
}(jQuery));

$(window).resize(function() {
   bannerVitrine.init();
});

bannerVitrine.prepareVideo();
bannerVitrine.init();
