

var modal = (function() {
    'use strict';

    var $document = $( document );

    var Selectors = {
        modal : '.modal'
    }

    $document.on( 'click', Selectors.targetDot, pauseVideo );

    function pauseVideo() {
        $(Selectors.modal).on('hidden.bs.modal', function (e) {
            var $iframes = $(e.target).find("iframe");
            $iframes.each(function(index, iframe){
                $(iframe).attr("src", $(iframe).attr("src"));
            });
        });
    }

    // RETORNA O INICIO DO CARREGAMENTO
    return {
        resolution : resolution
    };
}(jQuery));

modal.resolution();
