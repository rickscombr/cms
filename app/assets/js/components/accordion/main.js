	var Accordion = (function($) {

		'use strict';

		//=====================
		// SELECTORS
		//=====================

		var selectors = {
			active		  : 'active',
			openBody 	  : '.accordion-content-item',
			bindClick	  : '.bind-accordion'
		};


		//=====================
		// FUNCTIONS
		//=====================

		function createAccordion(){
			$( this ).next(selectors.openBody).toggleClass('active');
			$( this ).toggleClass(selectors.active);

			var text = $(this).text();
			dataLayer.push({
				'event': 'event',
				'eventCategory': 'claro:'+Utils.bredcrumb(),
				'eventAction': 'faq:click',
				'eventLabel': Utils.slugSimple(text)
			});

			return false;
		}


		function appEvents(){
			$( selectors.bindClick ).bind( 'click', createAccordion );
		}




		return {
			selectors      : selectors,
			appEvents      : appEvents,
			createAccordion: createAccordion
		};


	}(jQuery));

	Accordion.appEvents();
