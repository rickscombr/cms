var Porteira = (function($) {
    'use strict';


    //=====================
    // SELECTORS
    //=====================

    var selectors = {
        body: 'body',
        modal: '#preHome',
        navMenu: '#nav-menu',
        modalShow: '.modal-porteira',
        inputMobile: '#getValueAutocompleteMobile',
        formTopBar: '#formPreHomeTopBar',
        inputTopBar: '#getValueAutocompleteTopBar',
        formAutoComp: '#formPreHome',
        autocomplete: '#getValueAutocomplete',
        submitCookie: '#preHome .btn-submit',
        statusCliente: '.status-cliente strong',
        linkStatusCliente: '.status-cliente .status-link, .m-block-client .cliente-status',
        statusContrario: '.status-cliente .status-trocar-texto',
        estadoCliente: '.estado-cliente .cidades .target-cidades, .targetCookieCidadeMobile',
        alteraCookieM: '#formPreHomeMobile .alterar-cookie',
        alteraCookieD: '#formPreHomeTopBar .alterar-cookie',
        targetShowInit: '.status-cliente, .estado-cliente',
    };


    //=====================
    // VARS
    //=====================

    var objAttr = $(selectors.body).attr('data-objects'),
        menuRef = $(selectors.navMenu).offset().top,
        srcJson = Utils.getAmbiente() == 'local' ? 'data/cidades.json' : '/sites/api/cidades',
        getObjects = JSON.parse(objAttr)[0],
        urlCurrentPage = window.location.origin + window.location.pathname;


    //=====================
    // EVENTS
    //=====================

    function slug(valor, separador, item) {
        return valor.split(separador)[item].trim();
    }

    function appEvents() {
        $(selectors.formTopBar).bind('submit', breakSubmit)
        $(selectors.inputTopBar).bind('focus', dropDownCidade)
        $(selectors.inputTopBar).bind('focusout', clickVerifyDropDownCidade)
        $(selectors.formAutoComp).bind('submit', breakSubmit)
        $(selectors.submitCookie).bind('click', postcookiesPreHome)
        $(selectors.alteraCookieM).bind('click', parseValueM)
        $(selectors.alteraCookieD).bind('click', parseValueD)
        $(selectors.linkStatusCliente).bind('click', updateStatusClient)

        $window.scroll(startAnchor)
    }


    //=====================
    // RESQUEST
    //=====================

    function appLoad() {
        $.getJSON(srcJson)
            .fail(requestError)
            .done(startAutocomplete);
    }


    //=============================
    // PROPRIEDADES AUTOCOMPLETE
    //=============================

    var mountSelect = function(event, ui) {
        $(event)
            .attr('data-select-estado', ui.item.nome + '/' + ui.item.estado)
            .attr('data-select-prefixo', ui.item.cookie ? ui.item.cookie : 'null')
            .val(objectsReturn(ui));
    };

    var mountListItens = function(ul, item, termResult) {
        return $('<li class="item-lista" data-prefixo=' + item.cookie + '>')
            .append('<a>' + termResult + '/' + item.estado + '</a>')
            .appendTo(ul);
    };

    var objectsReturn = function(ret) {
        return ret.nome ? ret.nome : ret.item.nome + '/' + ret.item.estado;
    };

    var startAutocomplete = function(data) {
        var autocompleteList = [];

        if ($(selectors.inputTopBar).length != 0) {
            var autocompleteDesktop = new Utils.startAutocomplete(data, "8", selectors.inputTopBar, mountListItens, mountSelect, objectsReturn);

            autocompleteList.push(autocompleteDesktop);
        }

        if ($(selectors.inputMobile).length != 0) {
            var autocompleteMobile = new Utils.startAutocomplete(data, "8", selectors.inputMobile, mountListItens, mountSelect, objectsReturn);

            autocompleteList.push(autocompleteMobile);
        }

        if (Utils.slug(getObjects['porteira']) == "sim") {
            var autocompletePrehome = new Utils.startAutocomplete(data, "8", selectors.autocomplete, mountListItens, mountSelect, objectsReturn);

            autocompleteList.push(autocompleteDesktop);
        }

        requestDone();

        return autocompleteList[0], autocompleteList[1], autocompleteList[2];
    };


    //=====================
    // PRE-HOME
    //=====================

    function postcookiesPreHome() {
        var _getPrefixo = $(selectors.autocomplete).attr('data-select-prefixo'),
            _isClient = $(this).attr('data-home-type'),
            _redirect = _isClient == 'cliente' ? getObjects['home-cliente'] : getObjects['home-nao-cliente'],
            _getNomeCidade = conditionGetVal(getObjects['nome-cidade-padrao'], '0', selectors.autocomplete, 'data-select-estado'),
            _getEstado = conditionGetVal(getObjects['estado-padrao'], '1', selectors.autocomplete, 'data-select-estado');

        createCookie('cidade',_getPrefixo);
        createCookie('nome_cidade',_getNomeCidade);
        createCookie('uf',_getEstado);
        createCookie('home_url',_redirect);
        createCookie('isAssinante',(_isClient == 'cliente' ? "0" : "1"));

        urlRedirec(_redirect);
    }



    function urlRedirec(redirectAlternativo) {
        var previousUrl = window.location;

        if (previousUrl) {
            return window.location = urlCurrentPage;
        } else {
            return window.location = redirectAlternativo;
        }
    }


    //========================================
    // ATUALIZANDO HEADER CLIENTE/NÃO CLIENTE
    //========================================

    function updateStatusClient() {
        var _refCookie, _mountUrl, _updateText,
            _getStatus = $(this).attr('data-status'),
            _cidade = Utils.getCookie( 'cidade' ),
            _nome_cidade = Utils.getCookie( 'nome_cidade' ),
            _uf = Utils.getCookie( 'uf' );
            //_mountObject = JSON.parse(_getValue);
        //Se o cookie for 0, o usuário é assinante
        if (_getStatus == "0") {
            _refCookie = "1";
            _mountUrl = getObjects['home-nao-cliente'];
            _updateText = getObjects['texto-nao-cliente'];
        } else if (_getStatus == "1") {
            _refCookie = "0";
            _mountUrl = getObjects['home-cliente'];
            _updateText = getObjects['texto-cliente'];
        }

        $( selectors.statusCliente ).text( _updateText )

        createCookie('cidade',_cidade);
        createCookie('nome_cidade',_nome_cidade);
        createCookie('uf',_uf);
        createCookie('home_url',_mountUrl);
        createCookie('isAssinante',_refCookie);

        return window.location = urlCurrentPage;
    }


    //========================================
    // ATUALIZANDO TEXTOS DO HEADER
    //========================================

    function updateTexts() {
        //if (Utils.getCookie('home_type') != "undefined") {
            var _text, _textoContrario,
                _statusPage = Utils.slug(getObjects['status-page']),
                _isAssinante = Utils.getCookie( 'isAssinante' ),
                _homeUrl  = Utils.getCookie( 'home_url' );

            // SE O COOKIE ESTIVER COMO NÃO CLIENTE
            if (_isAssinante == "0") {
                var _ambiente = window.location.host,
                    _pathName = window.location.pathname,
                    _dev = "cms.devclaro.amxdev.net",
                    _text = getObjects['texto-cliente'];
                    _textoContrario = getObjects['texto-nao-cliente'];

                if ((_pathName == "/sites/claro/" || _pathName == "/sites/claro") && _ambiente == _dev && window.location.pathname != getObjects['home-cliente']) {
                    return window.location = getObjects['home-cliente'];
                } else if (_pathName == "/" && _ambiente != _dev && window.location.pathname != getObjects['home-cliente']) {
                    return window.location = getObjects['home-cliente'];
                }


                /*
                    Lógica1 = CASO O USUÁRIO ESTEJA COM COOKIE 'cliente' E ESTEJA TENTANDO ACESSAR 'Home Não Cliente', SERÁ REDIRECIONADO PARA 'Home Cliente'
                    Lógica2 = CASO O USUÁRIO ESTEJA COM COOKIE 'cliente' E ESTEJA ACESSANDO UMA PÁGINA EXCLUSIVA PARA 'nao-cliente', SERÁ REDIRECIONADO PARA 'Home Cliente'
                    Lógica3 = NAS DUAS LÓGICAS, A URL DE DESTINO PRECISA SER DIFERENTE DA URL ATUAL, EVITANDO LOOP INFINITO
                */
                if ((window.location.pathname == getObjects['home-nao-cliente'] && window.location.pathname != getObjects['home-cliente']) || (_statusPage == 'nao-cliente' && window.location.pathname != getObjects['home-cliente'])) {
                    return window.location = getObjects['home-cliente'];
                }
            }

            // SE O COOKIE ESTIVER COMO CLIENTE
            else if (_isAssinante == "1") {
                _textoContrario = getObjects['texto-cliente'];
                _text = getObjects['texto-nao-cliente'];

                if ((window.location.pathname == getObjects['home-cliente'] && window.location.pathname != getObjects['home-nao-cliente']) || (_statusPage == 'cliente' && window.location.pathname != getObjects['home-nao-cliente'])) {
                    return window.location = getObjects['home-nao-cliente'];
                }
            }

            $(selectors.body).addClass(_statusPage)
            $(selectors.linkStatusCliente).attr('data-status', _isAssinante)
            $(selectors.statusCliente).text(_text)
            $(selectors.statusContrario).text(_textoContrario)
        //}
    }


    function updateTextsCidade() {
        var _nome_cidade = Utils.getCookie( 'nome_cidade' ), _uf = Utils.getCookie( 'uf' );

        if( typeof(_nome_cidade) !== "undefined" && typeof(_uf) !== "undefined") {
            $( selectors.estadoCliente ).text( charLimit( _nome_cidade, 17 ) +'/'+_uf )
            $( selectors.targetShowInit ).css({ 'opacity' : '1' })
        }
    }


    //=========================
    // ALTERA COOKIE MOBILE
    //=========================

    function updateCidade(targetClass, targetClick) {

        var _getPrefixo  = $( targetClass ).attr( 'data-select-prefixo' ),
        _getCidade = conditionGetVal(getObjects['cidade-padrao'], '0', targetClass, 'data-select-prefixo'),
        _getNomeCidade = conditionGetVal(getObjects['nome-cidade-padrao'], '0', targetClass, 'data-select-estado'),
        _getEstado = conditionGetVal(getObjects['estado-padrao'], '1', targetClass, 'data-select-estado'),
        _isAssinante = Utils.getCookie( 'isAssinante' ),
        _homeUrl  = Utils.getCookie( 'home_url' );

        createCookie('cidade',_getCidade);
        createCookie('nome_cidade',_getNomeCidade);
        createCookie('uf',_getEstado);
        createCookie('home_url',_homeUrl);
        createCookie('isAssinante',_isAssinante);

        updateTextsCidade()
    }


    //=========================
    // STATUS REQUEST JSON
    //=========================

    function requestError() {
        // console.error( 'Erro requisição. Arquivo pode estar corrompido ou com caminho incorreto' )
    }

    function requestDone() {
        // console.log( '%c%s','color: #fff; background-color: rgb(125, 255, 58); padding: 3px;  font-weight: bold; width: 100%;font-size: 12px;', 'requisição feita com sucesso - cidades' );
    }

    function modal() {

        var cidade = Utils.getCookie( 'cidade' ),
                nome_cidade =  Utils.getCookie( 'nome_cidade' ),
                uf =  Utils.getCookie( 'uf' ),
                isAssinante = Utils.getCookie( 'isAssinante' ),
                home_url =  Utils.getCookie( 'home_url' );

        if (getObjects['porteira'] == 'Sim') {

            if( typeof(cidade)  !== "undefined" &&
                typeof(nome_cidade)  !== "undefined" &&
                typeof(uf) !== "undefined" &&
                typeof(isAssinante) !== "undefined" &&
                typeof(home_url) !== "undefined") {

                $(selectors.modal).hide();
                $('body').css('overflow-y', 'auto');
                $('header, main, footer').show();

                createCookie('cidade',cidade);
                createCookie('nome_cidade',nome_cidade);
                createCookie('uf',uf);
                createCookie('home_url',home_url);
                createCookie('isAssinante',isAssinante);

            } else {
                $(selectors.modalShow).show();
                $('body').css('overflow-y', 'hidden');
                $('header, main, footer').hide();
            }

            updateTexts()
            updateTextsCidade()


        }

        if (getObjects['porteira'] != 'Sim') {

            if( typeof(cidade)  !== "undefined" &&
                typeof(nome_cidade)  !== "undefined" &&
                typeof(uf) !== "undefined" &&
                typeof(isAssinante) !== "undefined" &&
                typeof(home_url) !== "undefined") {

                createCookie('cidade',cidade);
                createCookie('nome_cidade',nome_cidade);
                createCookie('uf',uf);
                createCookie('home_url',home_url);
                createCookie('isAssinante',isAssinante);

            } else {
                //var _cookieDefault = '{"home_type": "nao-cliente","home_url":"' + getObjects['home-nao-cliente'] + '","cidade":"' + getObjects['cidade-padrao'] + '","uf":"' + getObjects['estado-padrao'] + '","ddd":"' + getObjects['ddd-padrao'] + '"}',
                 var _cidade = getObjects['cidade-padrao'],
                 _nome_cidade = getObjects['nome-cidade-padrao'],
                _uf = getObjects['estado-padrao'] ,
                _isAssinante = "1",
                _homeUrl  =getObjects['home-nao-cliente'];

                createCookie('cidade',_cidade);
                createCookie('nome_cidade',_nome_cidade);
                createCookie('uf',_uf);
                createCookie('home_url',_homeUrl);
                createCookie('isAssinante',_isAssinante);

            }

            updateTexts()
            updateTextsCidade()
        }
    }



    //======================
    // FUNÇÕES DE ESTILO
    //======================

    function dropDownCidade() {
        event.stopPropagation()

        $('.estado-cliente').addClass('dropDownActive').find('.selectCidade').addClass('inputDropDownActive');
    }

    function clickVerifyDropDownCidade(event) {
        event.stopPropagation()

        $('.estado-cliente').removeClass('dropDownActive').find('.inputDropDownActive').removeClass('inputDropDownActive');
    }


    //==============
    // HELPERS
    //==============

    function anchors(menuRef) {
        var scrollingPosition = $window.scrollTop()

        if (scrollingPosition > menuRef) {
            $(selectors.navMenu).removeClass('static').addClass('moving')
        } else if (scrollingPosition <= menuRef) {
            $(selectors.navMenu).addClass('static').removeClass('moving')
        }
    }

    function startAnchor() {
        anchors(menuRef)
    }

    function breakSubmit() {
        return false;
    }

    function parseValueD(e) {
        var targetClick = $(this);
        console.log("INPUT " + selectors.inputTopBar);
        console.log("targetClick " + targetClick);

        updateCidade(selectors.inputTopBar, targetClick)

        return window.location = urlCurrentPage;
    }

    function parseValueM(e) {
        var targetClick = $(this);

        updateCidade(selectors.inputMobile, targetClick)

        return window.location = urlCurrentPage;
    }

    // DATA DE EXPIRAÇÃO DO COOKIE: DATA DE HOJE + Nº DE DIAS (em milisegundos)
    function expiresDate() {
        var _dateObj = Date.now();
        _dateObj += 1000 * 60 * 60 * 24 * (Number(getObjects['expiration-cookie']));
        _dateObj = new Date(_dateObj);

        return _dateObj.toGMTString();
    }

    // LIMITADOR DE CARACTERES PARA CIDADES
    function charLimit(input, size) {
        if (input.length <= size) {
            return input;
        }

        return input.substring(0, size) + "..."
    }

    // SE O INPUT ESTIVER VAZIO, SELECIONA A OPÇÃO PADRÃO DE CIDADE E ESTADO
    function conditionGetVal(valorPadrao, valSplit, classe, dataAttribute) {
        var _target = $(classe).attr(dataAttribute);

        if (_target) {
            return slug(_target, '/', valSplit);
        } else {
            return valorPadrao;
        }
    }

    function createCookie(name, value) {
        document.cookie = name + "=" + value + ';expires=' + expiresDate() + "; path=/";
    }


    //=====================
    // RETURN
    //=====================

    return {
        modal: modal,
        appEvents: appEvents,
        appLoad: appLoad,
        selectors: selectors,
        startAnchor: startAnchor
    };
}(jQuery));

Porteira.modal()
Porteira.appEvents()
Porteira.appLoad()
Porteira.startAnchor()