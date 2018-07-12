define(['adultos'], function() {

    var Gtm = (function($){

        var isBredcrumb = document.getElementsByClassName("breadcrumb"),
             typeClient = Utils.getCookie( 'isAssinante' ),
            cityUser = Utils.getCookie( 'nome_cidade' ),
            stateUser = Utils.getCookie( 'uf' ),
            linkEvent = $("a.gtm-link-event, .gtm-element-event");


        var bredcrumb = function(){

            if(isBredcrumb.length){

                return window.location.pathname;

            }else{

                return "nao_disponivel"
            }
        }


        function dimension(){

            window.dataLayer = window.dataLayer || [];


            /*if(decode != 'undefined'){

                var parseDecode = JSON.parse( decode ),
                    typeUser = Utils.slug(parseDecode.home_type),
                    cityUser = Utils.slug(parseDecode.cidade),
                    stateUser = Utils.slug(parseDecode.uf);
            }*/

            var typeUser = Utils.getCookie( 'isAssinante' ),
            cityUser = Utils.getCookie( 'nome_cidade' ),
            stateUser = Utils.getCookie( 'uf' );


            dataLayer.push({
                'dimension2': typeUser,
                'dimension3': cityUser+":"+stateUser,
                'dimension4': Utils.bredcrumb()
            });

        }

        function format(){

            if(isBredcrumb.length && isBredcrumb[0].getElementsByTagName("li").length >= 3){

                var levelBredcrumb = isBredcrumb[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].pathname;

                linkEvent.attr("data-gtm-category", "claro:"+levelBredcrumb);

            } else {

                linkEvent.attr("data-gtm-category", "claro:nao_disponivel");
            }

            linkEvent.each(function(){
                var linkCategory = $(this).attr("data-gtm-category");
                var linkLabel = $(this).attr("data-gtm-label");

                $(this).attr('data-gtm-label', Utils.slugSimple(linkLabel));
                $(this).attr('data-gtm-category', Utils.slugSimple(linkCategory));
            });

        }

        format();

        return {
            dimension : dimension,
            bredcrumb : bredcrumb,
            format : format
        };
    }(jQuery));

    Gtm.dimension();
    Gtm.format();
});
