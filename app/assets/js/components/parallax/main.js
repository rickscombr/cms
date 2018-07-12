$(document).scroll(function() {
	$('.conteudo').each(function(e) {
		
		var top 		 = $(this).offset().top, 
			scroll		 = $(document).scrollTop(), 
			altura		 = $(this).height(), 
			conteudoTop	 = $('.parallax').offset().top, 
			conteudo	 = $('.parallax').height();

		if(  scroll+(altura/2) > top &&  top > scroll-altura/1.6){/* magias do além*/			

			classe = $( this ).attr('data-img');
			
			if(classe != undefined ){
				
				classe = classe.toString();

				$('.div_bg div').removeClass('block');
				$('.div_bg .' + classe).addClass('block');

				$('.mascara div').removeClass('block');
				$('.mascara .' + classe).addClass('block');

				$('.nav_bullet a').removeClass('active');
				$('.nav_bullet .' + classe).addClass('active');
			}
		}

		if(  scroll+(altura/2) > conteudoTop && scroll  < conteudoTop+conteudo-altura/1.6){
			$('.nav_bullet').addClass('block');
			
		}else{
			$('.nav_bullet').removeClass('block');

		}
	})

});


$('.nav_bullet a[href^="#"]').on('click', function(e) {
	e.preventDefault();
	var id = $(this).attr('href'),
	targetOffset = $(id).offset().top;

	$('html, body').animate({ 
		scrollTop: targetOffset 
	}, 500);
});
