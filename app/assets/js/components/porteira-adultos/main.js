    var Adultos = (function($) {


        function expiresDate() {
            var date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000));

            return date.toGMTString();
        }

        var objAttr = $("body").attr('data-objects'),
            getObjects = JSON.parse(objAttr)[0],
            _Cookie = 'adulto=' + 'true' + ';expires=' + expiresDate() + ';path=/';


        function acceptTerms(url) {

            $("#aceitar-termos").click(function() {
                document.cookie = _Cookie;
                setTimeout(function() {
                    window.location = url;
                }, 100);
            });
        }

        function noAcceptTerms() {
            $("#nao-aceitar-termos").click(function() {
                window.location = "/";
            });
        }


        function checkCookie() {

            var referrer = document.referrer;

            acceptTerms(referrer);
            noAcceptTerms();

            if (getObjects['adultos'] == "sim" && !Utils.getCookie('adulto')) {

                if (getObjects['porteira'] == "Sim" && Utils.getCookie('cidade') || getObjects['porteira'] == "Não") {
                    window.location = window.location.origin + getObjects['porteira-adultos'];
                }

            }

        }







        return {
            acceptTerms: acceptTerms,
            noAcceptTerms: noAcceptTerms,
            checkCookie: checkCookie,
            noAcceptTerms: noAcceptTerms
        };


    }(jQuery));


    Adultos.checkCookie();