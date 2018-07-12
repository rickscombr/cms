var InjectViews = (function($) {

	'use strict';	

	var selectors = {
        require:    '[data-require]',
        inject:     []
    }


	function getComponent(){			

		$(selectors.require).each(function(){				

		    var dataRequire = $(this).data('require');

		    selectors.inject.push(dataRequire);			    		    
		});			
	}


	require(selectors.inject, function() {});



	return {
		getComponent : getComponent
	};	

	
	

}(jQuery));

InjectViews.getComponent();

