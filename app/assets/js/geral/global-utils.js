var Utils = (function($) {
    'use strict';

    console.log("carregando utils");
    //=====================
    // DEBOUNCE
    //=====================

    /*  
    	RESUMO:
    	Chama função ao FINAL da execução de um evento.
        Muito utilizada em resizes: Em um evento resize, a função em questão 
    	é chamada SOMENTE após o usuário parar de redimencionar a tela.
    */
    function debounce(func, wait, immediate) {
        var timeout;

        return function() {
            var context = this,
                args = arguments;

            var later = function() {
                timeout = null;

                if (!immediate) func.apply(context, args);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }


    //=====================
    // THROTTLE
    //=====================

    /*  
		RESUMO:
		Chama função ao final de cada intervalo de tempo, determinado na função.
	    Muito utilizada em resizes: Em um evento resize, a função em questão 
		é chamada após o intervalo de tempo passado como parâmetro na função.
	*/
    function throttle(fn, timeParameter, scope) {
        timeParameter || (timeParameter = 250);

        var last,
            deferTimer;

        return function() {

            var context = scope || this,
                now = +new Date,
                args = arguments;

            if (last && now < last + timeParameter) {
                clearTimeout(deferTimer);

                deferTimer = setTimeout(function() {
                    last = now;

                    fn.apply(context, args);

                }, timeParameter);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }


    //=====================
    // SLUG
    //=====================

    /*  
        INFO:
        Remove caracteres especiais, letras maiusculas, etc.
        Substitui espaços po hifens
    */
    function slug(str) {
        // TRIM 
        str = str.replace(/^\s+|\s+$/g, '');
        str = str.toLowerCase();

        // REMOVE ACCENTS, SWAP Ñ FOR N, ETC
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;",
            to = "aaaaaeeeeeiiiiooooouuuunc------";

        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        // REMOVE INVALID CHARS
        str = str.replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-') // COLLAPSE WHITESPACE AND REPLACE BY:
            .replace(/-+/g, '-'); // COLLAPSE DASHES

        return str;
    }

    function slugSimple(str) {

        if (str) {
            // TRIM 
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();

            // REMOVE ACCENTS, SWAP Ñ FOR N, ETC
            var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·_,;",
                to = "aaaaaeeeeeiiiiooooouuuunc------";

            for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            str = str.replace(/\s+/g, '-').replace(/-+/g, '-'); // COLLAPSE DASHES


            return str;
        }
    }

    //=====================
    // AUTOCOMPLETE
    //=====================

    /*
        LEMBRETE:
        Utiliza plugin JQUERY AUTOCOMPLETE
        Código utilizado no Header, para busca de cidades (tanto Mobile, quanto Desktop), portanto é
        chamado em praticamente todas as páginas. Além disso, é usado na página "RoamingBuscaPaíses".
    */
    function startAutocomplete(data, maxList, inputObject, mountListItens, mountSelect, objectsReturn) {
        var _targetList = $(inputObject).parents('.target-list'),
            _accentMap = {
                "à": "a",
                "á": "a",
                "â": "a",
                "ã": "a",
                "è": "e",
                "é": "e",
                "ê": "e",
                "ë": "e",
                "ì": "i",
                "í": "i",
                "î": "i",
                "ò": "o",
                "ó": "o",
                "ô": "o",
                "ö": "o",
                "õ": "o",
                "ù": "u",
                "ú": "u",
                "û": "u"
            };

        // REMOVENDO ACENTOS DO TEXTO INPUTADO NO AUTOCOMPLETE
        function normalize(term) {
            var _ret = "";

            for (var i = 0; i < term.length; i++) {
                _ret += _accentMap[term.charAt(i)] || term.charAt(i);
            }

            return _ret;
        }

        // PROPRIEDADES AUTOCOMPLETE
        $(inputObject).autocomplete({
                source: function(request, response) {
                    var maxResult = maxList,
                        outputAr = new Array(),
                        matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');

                    /*
                        PRECISO QUE O RESULTADO DA BUSCA TRAGA O NÚMERO ESPECÍFICO DE ITENS. 
                        O PLUGIN NÃO TEM UMA PROPRIEDADE DO TIPO "maxResult", NATIVA DO PLUGIN.
                        DESTA FORMA, CRIEI FUNÇÃO ABAIXO. USAR A VARIAVEL maxResult PARA INCLUIR O NÚMERO DE RESULTADOS
                    */
                    function filtroPesquisa() {
                        outputAr.push(
                            $.grep(data, function(item) {
                                return matcher.test(objectsReturn(item) || normalize(objectsReturn(item)));
                            })
                        )

                        return outputAr[0].slice(0, maxResult ? maxResult : false);
                    }

                    response(filtroPesquisa());
                },

                focus: function(event, ui) {
                    $(this).val(objectsReturn(ui));

                    return false;
                },

                select: function(event, ui) {
                    mountSelect(event.target, ui)

                    return false;
                },

                // ALVO PARA UL COM LISTA DE PAISES
                appendTo: _targetList,

                // ZERANDO ESTILO NATIVO DO PLUGIN
                open: function(event, ui) {
                    console.log(_targetList)
                    $('.ui-autocomplete').css('width', '100%')
                    $('.ui-autocomplete').css('left', '0px')
                }
            })
            .data('ui-autocomplete')._renderItem = function(ul, item) {
                var termResult = objectsReturn(item).replace(new RegExp('(?![^&;]+;)(?!<[^<>]* )(' + $.ui.autocomplete.escapeRegex(this.term) + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong>$1</strong>'); // INCLUI TAG "STRONG" PARA TEXTO BUSCADO FICAR EM NEGRITO NA LISTA DE ITENS

                return mountListItens(ul, item, termResult);
            };

        return false;
    }

    function getAmbiente() {
        if (window.location.hostname == 'localhost') {
            return 'local'
        } else {
            return 'online'
        }
    }

    function getCookie(name) {
        var value = "; " + document.cookie,
            parts = value.split('; ' + name + '=');

        if (parts.length == 2) return parts.pop().split(';').shift();
    }

    var bredcrumb = function() {

        var isBredcrumb = document.getElementsByClassName("breadcrumb");

        if (isBredcrumb.length) {

            return window.location.pathname;

        } else {

            return "nao_disponivel"
        }
    }

    return {
        slug: slug,
        debounce: debounce,
        throttle: throttle,
        getAmbiente: getAmbiente,
        startAutocomplete: startAutocomplete,
        getCookie: getCookie,
        slugSimple: slugSimple,
        bredcrumb: bredcrumb

    }
}(jQuery));


if (typeof exports !== 'undefined') {
    module.exports = Utils;
}