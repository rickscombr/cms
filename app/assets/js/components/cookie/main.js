    var cookie = (function(){
        'use strict';


        //=====================
        // SELECTORS
        //=====================

        var selectors = {
            statusCliente : '.status-cliente .cliente-status',
        };


        //=====================
        // EVENTS
        //=====================

        function appEvents(){
            $( selectors.statusCliente ).bind( 'click', updateCookieClient )
        }


        //========================================
        // ATUALIZANDO ITENS BASEADOS NO COOKIE
        //========================================




        //=====================
        // RETURN
        //=====================

        return {
            appLoad           : appLoad,
            selectors         : selectors,
            appEvents         : appEvents
        };
    }(jQuery));

    Cookie.appLoad()
    Cookie.appEvents()
