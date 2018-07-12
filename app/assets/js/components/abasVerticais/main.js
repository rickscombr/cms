var AbasVerticais = (function($) {

	'use strict';

	//=====================
	// SELECTORS
	//=====================

	var selectors = {
		active		  : 'active',
		contuedo 	  : '.conteudo_desc li',
		bindClick	  : '.conteudo_aba li'
	};


	//=====================
	// FUNCTIONS
	//=====================

	function appEvents(){
		$( selectors.bindClick ).click(function() {
			$(selectors.bindClick).removeClass('active');
			$(this).addClass('active');

			var item = $(this).attr('data-el');
			item = item.toString();
			$(selectors.contuedo).removeClass('active');
			$(".conteudo_desc ."+ item).addClass('active');

		});
	}

	return {
		selectors      : selectors,
		appEvents      : appEvents
	};


}(jQuery));

AbasVerticais.appEvents();
