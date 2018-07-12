'use strict';

//=====================
// VARS
//=====================

var $window   = $( window ),
	$document = $( document );


//=====================
// READY
//=====================

$document.ready( appInit );


//=====================
// APP
//=====================

// HIERARQUIA DE FUNÇÕES QUE SERÃO CHAMADAS NO DOCUMENT READY (APÓS O CARREGAMENTO DO DOM)
function appInit(){
	appSet();
	appEvents();
}

// PRIMEIRAS FUNÇÕES A SEREM CHAMADAS COM O CARREGAMENTO DA PÁGINA
function appSet(){
}

// ENCAPSULA TODOS OS EVENTOS (CLICK, MOUSEOVER, ETC)
function appEvents(){
	$( MenuDropDown.selectors.targetMenuDropDown ).bind( 'click', MenuDropDown.dropDownGeneralMenu );
	// $( MenuDropDown.selectors.targetMenuDropDown ).bind( 'focusin', MenuDropDown.focusOut )

	//$window.on( 'resize', Menu.closeMenuResize );
}