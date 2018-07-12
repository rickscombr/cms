var Abas = (function( $ ){
    'use strict';


   //=====================
    // SELECTORS
    //=====================

    var selectors = {
        tabBody:    '.tabs-body',
        active:     'active',
        link:       '.tabs-wrap a',
        wrap:       '.tabs-wrap',
        bindMobile: '.tab-bind-accordion',
        openBody:   '.tabs-body-item',
        tabsAccordion: '.tabs-accordion',
        wrapTabs:   '.wrap-tabs'
    };


   //=====================
    // FUNCTIONS
    //=====================


    function create(){

        var getId         = '#'+$( this ).closest('.tabs-accordion ').attr( 'id' ),
        targetHref    = $( this ).attr( 'href' ),
        targetLink    = getId+' '+selectors.link,
        targetHrefId  = getId+' '+targetHref,
        targetActive  = getId+' '+selectors.active,
        targetTabBody = getId+' '+selectors.tabBody,
        content = $(this).text();

        dataLayer.push({
            'event': 'event',
            'eventCategory': 'claro:'+Utils.bredcrumb(),
            'eventAction': 'abas:click',
            'eventLabel': Utils.slugSimple(content)
        });

        $( targetLink ).parent().removeClass( targetActive );
        $( targetTabBody ).removeClass( targetActive );
        $( this ).parent().addClass( targetActive );
        $( targetHrefId ).addClass( targetActive );

        return false;
    }


    function activeTabs(){
        $( selectors.tabsAccordion ).each( function(){
            $(this).find(".tabs-bind-item:first").addClass( selectors.active );
            $(this).find(".tabs-body:first").addClass( selectors.active );
        });
    }


    function deviceVerify( device ) {
        return $( selectors.wrapTabs ).hasClass( device )
    }

    function renderMobile(){

        if( $( window ).outerWidth() <= 1024 ){
            $( selectors.wrapTabs ).removeClass( 'isDesktop' ).addClass( 'isMobile' )
            $( this ).next('.tabs-body-item').toggleClass('active' );
            $( this ).toggleClass('active' );

        }
        else if( $( window ).outerWidth() >= 1025 ) {

            if( deviceVerify( 'isMobile' ) ){
                $( selectors.wrapTabs ).removeClass( 'isMobile' ).addClass( 'isDesktop' );
                $( selectors.link ).parent().removeClass( selectors.active );
                $( selectors.tabBody ).removeClass( selectors.active );

                activeTabs();
            }
            else if( deviceVerify( 'isDesktop' ) == false ) {
                activeTabs();

                $( selectors.wrapTabs ).removeClass( 'isMobile' ).addClass( 'isDesktop' );
            }
        }

        return false;
    }

    function resize(){
        var resizeTimer;

        clearTimeout( resizeTimer );

        resizeTimer = setTimeout(function(){
           renderMobile();
       }, 0);
    }


    function appEvents(){
        $( selectors.link ).bind( 'click', create );
        $( selectors.bindMobile ).bind( 'click', renderMobile );
        $(window).resize(function(){resize();});
    }


   //=====================
    // EXPORTS
    //=====================

    return {
        renderMobile: renderMobile,
        resize      : resize,
        create      : create,
        appEvents   : appEvents,
        selectors   : selectors
    };

    appInit();

}(jQuery));


Abas.appEvents();
Abas.renderMobile();
