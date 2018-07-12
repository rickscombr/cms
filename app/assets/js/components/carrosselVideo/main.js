var standardCarouselVideo = (function(){
	'use strict';


	//=====================
    // SELECTORS
    //=====================

	var Selectors = {
		getComponente : '[data-componente="carrosselVideo"]',
		startCarousel : '[data-componente="carrosselVideo"] .owl-carousel',
    	itemVideo     : '[data-componente="carrosselVideo"] .carrosselVideo [data-id-video]',
		eachVideo     : '[data-componente="carrosselVideo"] .promo-video',
		changeButton  : '[data-componente="carrosselVideo"] [data-change-image]'
	};


	//=====================
    // EVENTS
    //=====================

    function appEvents(){
		$( Selectors.itemVideo ).one( 'click', getIdVideo );
		$( Selectors.changeButton ).on( 'click', timeoutAction );
		$( Selectors.changeButton ).mouseenter( showImageNextPrev );
		$( Selectors.changeButton ).mouseout( hideImageNextPrev );
		
		$( window ).scroll( scrollPauseVideo );
    }


	//=====================
    // CADA CARROSSEL
    //=====================

	var initCarouselVideo = function(){
		$( Selectors.startCarousel ).owlCarousel({
	        dots     : false,
	        loop     : false,
		    touchDrag: false,
		    mouseDrag: false,
	        lazyLoad : true,
	        video    : true,
	        nav      : true,
	        items    : 1,
	        margin   : 10,
	        navText  : ['<span class="ilustra"></span><i class="fa fa-angle-left" aria-hidden="true" data-change-image="prev"></i>','<span class="ilustra"></span><i class="fa fa-angle-right" aria-hidden="true" data-change-image="next"></i>'],
	        onTranslate: function(){
                pauseVideo()
            },
	    })
	};


	//=============================
    // MONTAGEM IFRAME DE VÍDEO
    //=============================

	function getIdVideo( valueId, $this, valueH ){
		$this   = $( this );
		valueId = $this.attr( 'data-id-video' );

		mounthVideo( valueId, $this )
	}

	function mounthVideo( vals, $this ){
		$this.find( 'picture' ).remove();

		$this.append( '<iframe class="promo-video" width="100%" src="https://www.youtube.com/embed/'+vals+'?rel=0&amp;showinfo=0&amp;autoplay=1;enablejsapi=1&version=3&playerapiid=ytplayer" frameborder="0" allowfullscreen></iframe>' );
	}


	//=====================
    // PAUSE VÍDEO
    //=====================

	function pauseVideo( indexVideo ){
		indexVideo = $( Selectors.eachVideo );

		if( indexVideo ){
			indexVideo.each(function( index ){
				$( this )[0].contentWindow.postMessage( '{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*' ); 
			})
		}
	}

	function scrollPauseVideo( heightSection, topSection, scrollUsuario, bottomSection, middleSection ){
		heightSection  = $( Selectors.getComponente ).height();
		topSection     = $( Selectors.getComponente ).position().top;
		middleSection  = topSection / 2;
		bottomSection  = heightSection + topSection;
        scrollUsuario  = $( window ).scrollTop();

        if( scrollUsuario <= middleSection || scrollUsuario >= bottomSection ){
        	pauseVideo()
        }
	}


	//=====================
    // FUNÇOES DE ESTILO
    //=====================

    function timeoutAction( escopeMouseOver ){
    	escopeMouseOver = this;

    	setTimeout(function(){
    		showImageNextPrev( escopeMouseOver )
    	}, 50)
    }

	function showImageNextPrev( escopeMouseOver ){
		var _getObjClicado = $( this ).attr( 'data-change-image' ) ? $( this ).attr( 'data-change-image' ) : $( escopeMouseOver ).attr( 'data-change-image' ),
			_escopeEvents  = this ? this : escopeMouseOver,
			_parentObject  = _escopeEvents.closest( '.sectionComponent' );

		if( _getObjClicado == 'next' ){
			$( _parentObject ).find( '.owl-next .ilustra' ).addClass( 'proxima-imagem' );
			$( _parentObject ).find( '.proxima-imagem' ).css({ 'background-image' : 'url( https://img.youtube.com/vi/'+getIdVideoNextPrev( _parentObject, 1 )+'/maxresdefault.jpg )' })
		}
		else if( _getObjClicado == 'prev' ) {
			$( _parentObject ).find( '.owl-prev .ilustra' ).addClass( 'anterior-imagem' );
			$( _parentObject ).find( '.anterior-imagem' ).css({ 'background-image' : 'url( https://img.youtube.com/vi/'+getIdVideoNextPrev( _parentObject, -1 )+'/maxresdefault.jpg )' })
		}
	}

	function hideImageNextPrev(){
		setTimeout(function(){
			$( '.ilustra' ).removeClass( 'proxima-imagem anterior-imagem' );
		}, 100)
	}

	function getIdVideoNextPrev( parentObject, targetItem ){
		var _indexAtivoItem   = $( parentObject ).find( '.owl-item.active' ).index() + targetItem,
			_targetIndex      = $( parentObject ).find( '.owl-item' ).eq( _indexAtivoItem )[0];

		// VERIFICA SE CHEGOU NO ÚLTIMO OU NO PRIMEIRO ITEM DO CARROSSEL
		if( _targetIndex && _indexAtivoItem >= 0 ){
			var _indexProximoItem = _targetIndex.innerHTML,
				_getIdVideo       = $( _indexProximoItem ).attr( 'data-id-video' );

			return _getIdVideo;
		}
	}


	//============
    // EXPORTS
    //============

	return {
		appEvents         : appEvents,
		initCarouselVideo : initCarouselVideo
	};
}(jQuery));

standardCarouselVideo.initCarouselVideo();
standardCarouselVideo.appEvents();