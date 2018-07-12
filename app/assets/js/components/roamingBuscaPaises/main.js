    var Roaming = (function($){
           'use strict';


        //=====================
        // SELECTOR
        //=====================

        var selectors = {
            buttonSearch  : '#formRoaming .btn',
            formAutoComp  : '#formRoaming',
            autocomplete  : '#getValueAutocompleteRoaming',
            textError     : '.msg-erro',
            uiMenu        : '.form-roaming-paises .ui-menu'
        };


        //=====================
        // VARS
        //=====================

        var focusOut,
            srcJson = Utils.getAmbiente() == 'local' ? 'data/paises.json' : '/sites/api/paises';


        //=====================
        // VAR TEXTS
        //=====================

        var textRequestError = 'Erro requisição. Arquivo pode estar corrompido ou com caminho incorreto',
            textRequestDone  = 'requisição feita com sucesso - países';


        //=====================
        // EVENTS
        //=====================

        function appEvents(){
            $( selectors.formAutoComp ).bind( 'submit', breakSubmit )
            $( selectors.autocomplete ).bind( 'submit', breakSubmit )
            $( selectors.buttonSearch ).bind( 'click', activeSearch )
            $( selectors.autocomplete ).bind( 'focusout', conditionFocusOut )
            $( selectors.autocomplete ).on( 'keydown', enterInput )
        }


        //=====================
        // RESQUEST
        //=====================

        function appLoad(){
            $.getJSON( srcJson )
            .fail( requestError )
            .done( initAutocomplete );
        }

        //=============================
        // PROPRIEDADES AUTOCOMPLETE
        //=============================

        var mountSelect = function( event, ui ){
            var isMsgError = $( selectors.autocomplete ).attr( 'data-select-msg-erro' );

            $( event ).attr( 'data-select-pais', objectsReturn( ui ) )
                     .attr( 'data-select-url', ui.item._link_ )
                     .val( objectsReturn( ui ) );

            if( isMsgError ){
                $( '.msg-erro' ).hide();
            }
        }

        var mountListItens = function( ul, item, termResult ){
            return $( '<li class="item-lista" data-pais-url="'+item._link_+'">' )
                .append( '<a>' + termResult + '</a>' )
                .appendTo( ul )
        }

        var objectsReturn = function( ret ){
            return ret.pais ? ret.pais : ret.item.pais;
        }

        var initAutocomplete = function( data ){
            var autocompletePaises = new Utils.startAutocomplete( data, "8", selectors.autocomplete, mountListItens, mountSelect, objectsReturn )

            requestDone()

            return autocompletePaises;
        }


        //=========================
        // STATUS REQUEST JSON
        //=========================

        function requestError(){
            // console.error( textRequestError )
        }

        function requestDone(){
            // console.debug( '%c%s','color: #fff; background-color: rgb(105, 202, 0); padding: 3px;  font-weight: bold; width: 100%;font-size: 12px;', textRequestDone )
        }


        //=========================
        // MENSAGEM DE ERRO
        //=========================

        /*
            CONDIÇÃO:
            Se o usuário não tiver selecionado um valor ou um valor válido;
            É apresentada mensagem de erro
        */
        function activeSearch(){
            var _verifyAttr = $( selectors.autocomplete ).attr( 'data-select-pais' ),
                _verifyUrls = $( selectors.autocomplete ).attr( 'data-select-url' );

            if( _verifyAttr != focusOut || !_verifyAttr ){
                $( selectors.textError ).show();
                $( selectors.uiMenu ).hide();

                return false;
            }
            else{
                $( selectors.textError ).hide();

                // SE JSON RETORNAR ALGUMA URL, A PÁGINA SERÁ REDIRECIONADA PARA ESTA URL
                if( _verifyUrls ){
                    return window.location.href = '/'+_verifyUrls;
                }
                // SE NÃO TIVER URL, MONTA-SE UMA COM O NOME DO PAÍS
                /*else{
                    return window.location.href = 'celular/roaming-internacional/tarifas/'+Utils.slug( _verifyAttr );
                }*/
            }
        }

        // NO EVENTO "onFocus", LIMPA ATRIBUTOS data-select-pais e data-select-id
        function conditionFocusOut(){
            focusOut = $( selectors.autocomplete ).val();

            if( !focusOut ){
                $( selectors.autocomplete )
                    .attr( 'data-select-pais', '' )
                    .attr( 'data-select-url', '' )
            }

            return false;
        }

        // VERIFICA SE DIGITOU ENTER
        function enterInput( e ){
            if( e.keyCode == 13 ){
                return submitFormInput();
            }
        }

        // CHAMA FUNÇÃO DE VALIDAÇÃO. ESTANDO OK, SUMIT FORM
        function submitFormInput(){
            conditionFocusOut()
            activeSearch()

            return false;
        }

        function breakSubmit(){
            return false;
        }


        //=====================
        // RETURN
        //=====================

        return {
            appLoad   : appLoad,
            selectors : selectors,
            appEvents : appEvents
        };
    }(jQuery));

    Roaming.appLoad()
    Roaming.appEvents()
