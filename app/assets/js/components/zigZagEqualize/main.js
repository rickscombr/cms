define(['zigZagLinear'], function() {

    'use strict';

    var Equalize = (function($){


        //=====================
        // SELECTORS
        //=====================

        var selectors = {
            container      : '[data-equalize="true"]',
            targetFigure   : '.zigzag-image',
            targetResets   : '.zigzag-image',
            boxConteudo   : '.boxConteudo',
            targetCarousel : '[data-swipe="zigzag-linear"]'
        };



        var refREsize = $window.width();


        //=====================
        // FUNCTIONS
        //=====================

        function restartHeights(){
            $( selectors.targetResets ).height( 'auto' )
            $( selectors.targetCarousel ).removeClass( 'owl-carousel' )
        }

        function equalizeHeight(){
            $( selectors.container ).each( function( index ){
                var _refBoxHeigth    = 0;
                var _referenceFigure = 0;
                var _divConteudo = 0;
                var _defaultConteudo = 0;

                $( '.linear-itens', this ).each(function(){
                    var _currentfigure    = $( this ).find( selectors.targetFigure ).height();
                    var _divConteudo    = $( this ).find( selectors.boxConteudo ).height();

                    if( _currentfigure > _referenceFigure ){
                        _referenceFigure = _currentfigure;
                    }

                    if( _divConteudo > _defaultConteudo ){
                        _defaultConteudo = _divConteudo;
                    }


                })

                $( this ).find( selectors.targetFigure ).height( _referenceFigure );
                $( this ).find( selectors.boxConteudo ).height( _defaultConteudo );

            });
        }


        function initCarousel() {
            $( selectors.targetCarousel ).each( function( indexItem ){



                 var numberItems   = $( this ).find( '.linear-itens' ).length,
                     indice        = indexItem;


                if( ( numberItems >= 2 && $( window ).outerWidth() <= 599 ) || ( numberItems >= 5 ) || ( numberItems >= 3 && $( window ).outerWidth() <= 1024 )){
                    $( this ).addClass( 'owl-carousel item-'+indice )


                    setTimeout( function(){
                        ZigzagLinear.createCarousel( indice )
                    }, 30)

                }
                else if( numberItems <= 4 && $( window ).outerWidth() >= 1024 ){
                    setTimeout( function(){
                        ZigzagLinear.removeCarousel( indice )
                     }, 30)
                }
            })
        }


        function init(){
            initCarousel();

            setTimeout( function(){
                equalizeHeight()
            }, 600 )
        }


        function resize(){
            ZigzagLinear.removeCarousel()
            restartHeights()

            initCarousel()

            setTimeout( function(){
                equalizeHeight()
            }, 500 )
        }


        function impedeResizeVertical(){
            var newWidth = $window.width();

            if ( newWidth != refREsize ){

                Utils.debounce( resize(), 1500 )

                refREsize = newWidth;
            }
        }



        function appEvents(){
            $(window).resize(function(){impedeResizeVertical()});
        }


        return {
            init                : init,
            resize              : resize,
            selectors           : selectors,
            restartHeights      : restartHeights,
            equalizeHeight      : equalizeHeight,
            appEvents           : appEvents
        };


    }(jQuery));


    Equalize.init();
   Equalize.appEvents();


});


