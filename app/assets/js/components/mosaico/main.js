	var MosaicoInterno  = ( function(){
		/* ######## Seletores ######## */
		var Selectors = {
			carouselActive: "owl-carousel owl-theme",
			targetCarousel: "[data-swipe='owl']"
		}


		/* ######## cria carrossel ######## */
		function createCarousel(){

			$(Selectors.targetCarousel).addClass(Selectors.carouselActive);
				window.carousel = $(Selectors.targetCarousel).owlCarousel({
					loop:false,
					margin:15,
					nav:false,
					center:false,
					responsive:{
						0:{
							items:1,
							center:false,
							margin:0

						},
						600:{
							items:3,
						}
					}
				})
		}

		function removeCarousel(){

			$(Selectors.targetCarousel).removeClass(Selectors.carouselActive);
			$(Selectors.targetCarousel).trigger('destroy.owl.carousel');
		}

		function resizeMosaico(){
			if($(window).width() < 1023){

				createCarousel();
			}else if($(window).width() >= 1024){

				removeCarousel();
			}


		}

		/* ######## Manipula DOM responsivo ######## */
		function init(){
			resizeMosaico();
			$(window).on('resize', Utils.debounce(resizeMosaico,100));

		}

		return {
			init : init
		};

	}());
	MosaicoInterno.init();
