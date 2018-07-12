define(['zigZagLinear', 'utils'], function() {

    'use strict';

    var Equalize = (function($){  


        //=====================
        // SELECTORS
        //=====================

        var selectors = {
            container      : '[data-equalize="true"]',
            targetLink     : '.wrap-btn',
            targetDesc     : '.equalize-height',
            targetTitle    : '.zigzag-title',
            targetFigure   : '.zigzag-image',
            targetResets   : '.zigzag-title, .zigzag-image, .equalize-height, .wrap-btn',
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
                var _referenceTitle  = 0,
                    _referenceDesc   = 0,
                    _referenceLink   = 0,
                    _refBoxHeigth    = 0;

                 var _referenceFigure = 0;

                $( '.linear-itens', this ).each(function(){
                    var _currentfigure    = $( this ).find( selectors.targetFigure ).height(),
                        _currentDescricao = $( this ).find( selectors.targetDesc ).height(),
                        _currentTitulo    = $( this ).find( selectors.targetTitle ).height(),
                        _currentLink      = $( this ).find( selectors.targetLink ).height();


                    /* 
                        Classe '_reference': Possui sempre a maior altura de todas as interações.
                        Classe '_current'  : Possui a altura do elemento a ser comparado (título, descrição, link ou figura)

                        A altura do elemento mais alto é armazenada na classe '_reference'.
                        É possivel comparar se a altura do elemento em questão é superior a maior altura até então.
                        Se for maior, ele passa a ser o elemento mais alto. Sua altura passa a ser armazenada na variavel '_reference'.
                        Se não for a mais alta, não faz nada.
                    */

                    // FIGURA
                    if( _currentfigure > _referenceFigure ){
                        _referenceFigure = _currentfigure;
                    }

                    // TÍTULO               
                    if( _currentTitulo > _referenceTitle ){
                        _referenceTitle = _currentTitulo;
                    }

                    // DESCRIÇÃO
                    if( _currentDescricao > _referenceDesc ){
                        _referenceDesc = _currentDescricao;
                    }

                    // LINK
                    if( _currentLink > _referenceLink ){
                        _referenceLink = _currentLink;
                    }

                    // Caso o box não tenha o elemento de link, será incluída a classe special-padding no box.
                    // Esta classe receberá um 'padding-bottom' com a altura do maior botão de todos os boxes.                
                    if( $( this ).find( selectors.targetLink ).length == '0' ) {
                        $( this ).addClass( 'special-padding' );
                    }
                })

                $( this ).find( selectors.targetFigure ).height( _referenceFigure )
                $( this ).find( selectors.targetTitle ).height( _referenceTitle )
                $( this ).find( selectors.targetDesc ).height( _referenceDesc )
                $( this ).find( selectors.targetLink ).height( _referenceLink )

                equalizaAlturaBox( _refBoxHeigth, this )
            });
        }

        function equalizaAlturaBox( hRefBox, ref ){
            var numberItems = $( ref ).find( '.linear-itens' ).length;
            
            $( '.linear-itens', ref ).each( function(){
                if( $( this ).find( selectors.targetLink ).length == '1' ){
                    hRefBox = $( this ).find( '.zigzag-caption' ).height();

                    $( ref ).find( '.special-padding .zigzag-caption' ).height( hRefBox  );

                    return false;
                }
            });
        }


        function initCarousel() {
            $( selectors.container ).each( function( indexItem ){



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

            /*setTimeout( function(){
                equalizeHeight()
            }, 60 )*/
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
   //Equalize.appEvents();
    

});


