var DestaqueAssinante = (function($){
	
	'use strict';


	var Selectors = {
		open: ".OpenDestaqueAssinante",
		target: "[data-show='destaque-assinante']",
		icon: ".OpenDestaqueAssinante i",
		iconUp: "neticon-seta_up2",
		iconDown: "neticon-seta_down2"
	}

	function createToggle(){
		$(Selectors.open).click(function(){
			if($(Selectors.target).is(':hidden')) {
				$(Selectors.target).slideDown();
				$(Selectors.icon).addClass(Selectors.iconUp).removeClass(Selectors.iconDown);
			} else {
				$(Selectors.target).slideUp();
				$(Selectors.icon).addClass(Selectors.iconDown).removeClass(Selectors.iconUp);
			}
		});
	}


	return {
		createToggle : createToggle,
	}

	
}(jQuery));

DestaqueAssinante.createToggle();