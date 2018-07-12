var GradePorgramacao = (function() {

	'use strict';

	
	//=====================
	// Variaveis
	//=====================

	var Variaveis = {
		timeServer      : '',
		dia				: '',
		diaZeroHora				: '',
		diaSeguinte				: '',
		horaAtual		: '',
		canais_id 		: '',
		canais_nome 	: [],
		canais_li 		: [], // para ordenar a lista na mesma ordem que foi feita, coisa que o Solr deveria fazer...
		id_cidade		: '1', // id da cidade regionalizada
		ordenaCanais    : 'asc', // ordenação dos canais da grade... desc ou asc
		ordemCampo		: 'cn_canal',
		rows            : 10, // numero de canais a cada interação
		rowsStart       : 0, // start da lista de canais
		rowsBusca		: '10', // numero de resultados do campo busca
		canalNome       : '',
		filtroBusca       : '',
		id_categoria	: '' 
	}


	//=====================
	// SELECTORS
	//=====================

	var Selectors = {
		timeServer      : '.btn-more',
		filtroCanal		: '.f_canal',
		filtroOrdem		: '.f_ordem',
		filtroTipo		: '.f_tipo',
		trocaDia		: '.datepicker .calendario a',
		filtroBusca		: '.f_busca'
	}


	
	//=====================
	// AJAX
	//=====================

	function ajax(tipo, callback) {

		if( tipo == 'horaServer' ){
			$.get({
				type: "GET",
				url: 'https://www.netcombo.com.br/cs/Satellite/NET/tools/GetTimeServer',
				success: function(data) {

					Variaveis.timeServer = eval(data);
					Variaveis.horaAtual = moment.utc(Variaveis.timeServer).local().format('hh:mm');
					Variaveis.dia = moment.utc(Variaveis.timeServer).local().format('YYYY-MM-DD');

					Variaveis.diaZeroHora = moment.utc(Variaveis.dia+'T00:00Z');
					Variaveis.diaSeguinte = moment(Variaveis.diaZeroHora).add(1, 'days');

					linhaTempo(moment(Variaveis.timeServer).local().format('YYYY-MM-DD HH:mm'));

					ajax('listaCanais','callbackChannels');
					calendario();
				}

			});

		}else if( tipo == 'listaCanais' && callback !== undefined && callback !== ''){

			if(callback == 'callbackChannels'){

				var id_categoria =  ((Variaveis.id_categoria !== '') ? "&fq=id_categoria:"+Variaveis.id_categoria : "");
				
				var url = 'https://programacao.netcombo.com.br/gatekeeper/canal/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackChannels&json.wrf=callbackChannels&wt=json&rows=' + Variaveis.rows + '&start=' + Variaveis.rowsStart + '&sort=' + Variaveis.ordemCampo + ' '+ Variaveis.ordenaCanais +'&fl=id_canal st_canal cn_canal nome&fq=nome:' + Variaveis.canalNome + '*'+ id_categoria +'&_=' +Variaveis.timeServer;

			}else if(callback == 'callback'){
				
				var url = 'https://programacao.netcombo.com.br/gatekeeper/prog/select?q='+ Variaveis.filtroBusca +'*&callback=callback&start=0&rows=20&wt=json&fl=titulo+descricao+st_titulo+id_programa&json.wrf=callback&_=' +Variaveis.timeServer;

			}else{			

				var	url = 'https://programacao.netcombo.com.br/gatekeeper/exibicao/select?q='+ Variaveis.canais_id +'&callback=callbackShows&json.wrf=callbackShows&wt=json&rows=100000&sort=id_canal asc,dh_inicio asc&fl=dh_fim dh_inicio st_titulo titulo id_programa id_canal&fq=dh_inicio:['+ Variaveis.dia +'T00:00:00Z TO '+ Variaveis.dia+'T23:59:00Z]';

			}

			$.getJSON({
				type: "GET",
				url: encodeURI(url),
				jsonpCallback: callback,
				dataType: "jsonp",
				cache: true,
				success: function(data) {
					if(callback == 'callbackChannels'){
						if(data.response.docs.length > 0){
							montaCanais(data.response.docs);
							$('.sem-resultado').hide();
							// console.log('callbackChannels >>> ', data.response.docs);
						}else{
							$('.sem-resultado').show();
						}
					}else if(callback == 'callback'){
						resutadoBusca(data.response.docs);	
					}else{
						//prepara json removendo programas duplicados 
						// console.log('data >>> ', data.response.docs);
						removeProg(data.response.docs);

					}
				}			
			});
			console.log(encodeURI(url));

		}
	}

	//=====================
	// FILTROS
	//=====================
	$(Selectors.filtroCanal).submit(function(e){
		
		e.preventDefault();
		var canal = $('#channelName').val();		

		Variaveis.canalNome = canal;
		Variaveis.rows = 	Variaveis.rowsBusca;
		ajax('listaCanais','callbackChannels');
		limpaGrade();
		
	});

	$(Selectors.filtroOrdem).change(function(e){
		e.preventDefault();

		var ordem = $('#orderBy').val();

		if ( ordem !== ""){

			ordem = ordem.split(' ');

			Variaveis.ordemCampo   = ordem[0];
			Variaveis.ordenaCanais = ordem[1];
			Variaveis.rows 		   = Variaveis.rowsBusca;

			ajax('listaCanais','callbackChannels');			
			
			limpaGrade();
		}
	});

	$(Selectors.filtroTipo).change(function(e){
		e.preventDefault();

		var filtroTipo = $('#channelType').val();

		if ( filtroTipo !== ""){
			Variaveis.rowsStart = 0;

			Variaveis.id_categoria = filtroTipo == "all" ?  Variaveis.id_categoria = '' : filtroTipo;
			Variaveis.rows = 	Variaveis.rowsBusca;
			ajax('listaCanais','callbackChannels');
			limpaGrade();
		}


	});

	$(Selectors.filtroBusca).submit(function(e){
		e.preventDefault();

		var filtroBusca = $('#genericSearch').val();
		$('#resulBuscaProg li').remove();
		if ( filtroBusca !== ""){

			Variaveis.filtroBusca = filtroBusca;		
			ajax('listaCanais','callback');
		}

	});

	$(Selectors.filtroBusca).keypress(function(e){

		var filtroBusca = $('#genericSearch').val();

		if ( filtroBusca.length >= 2){
			$('#resulBuscaProg li').remove();
			Variaveis.filtroBusca = filtroBusca;		
			ajax('listaCanais','callback');
		}

	});

	$(document).mouseup(function(e){
		var container = $("#resulBuscaProg");

		if (!container.is(e.target) && container.has(e.target).length === 0){
			$('#resulBuscaProg li').remove();
		}
	});

	function limpaGrade(){
		$('.canal_lista li').remove();
		$('.prog_lista li').remove();
	}

	//=====================
	// Resultado de busca
	//=====================

	function resutadoBusca(data){
		var canal = data, html_canal = "", canais;
		Variaveis.canais_id = "";
		$('#resulBuscaProg li').remove();

		for(var i in canal){
			
			canais = canal[i];
			

			html_canal +=	'<li>\
			<a href="grade/programa?canal=now_1015&prog='+ Utils.slug(canais.titulo) +'_'+canais.id_programa+'" title="'+canais.titulo+'">\
			<h3>'+canais.titulo+'</h3>\
			<div class="desc">'+canais.descricao+'</div>\
			</a>\
			</li>';
		}

		if(canal.length == 0){

			html_canal +=	'<li>\
			<a>\
			<h3>Nenhum resultado encontrado.</h3>\
			</a>\
			</li>';
		}

		$('#resulBuscaProg ul').append(html_canal);


	}


	function calendario(){

		var target, observer, config;

		$('[data-toggle="datepicker"]').datepicker({
			autoHide: true,
			offset:12,
			zIndex: 8,
			inline: false,
			language:"pt-BR",
			format:"dd/mm/yyyy",
			endDate: moment().add(27, 'days').format('DD-MM-YYYY'),
			startDate: ' ',
			format: 'dd/mm/yyyy',
			days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
			daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
			daysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
			months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
			monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
			inline: true,
			container: '.calendario',


		});


		target = document.getElementById( 'diaGrade' );
		observer = new MutationObserver( handleMutationObserver );
		config = { childList: true};

		//
		//  Apos o click no calendario inicia a grade no dia clicado
		//

		function handleMutationObserver( mutations ) {

			var dia = mutations[0].target.innerHTML;
			dia = dia.split('/');

			Variaveis.dia = dia[2]+'-'+dia[1]+'-'+dia[0];
			Variaveis.diaZeroHora = moment.utc(Variaveis.dia+'T00:00Z');
			Variaveis.diaSeguinte = moment(Variaveis.diaZeroHora).add(1, 'days');
			Variaveis.rows = 10;
			Variaveis.rowsStart  = 0;
			
			
			ajax('listaCanais','callbackChannels');
			$('.calendario ').toggle("slow");
			limpaGrade();


		}

		observer.observe( target, config );

		$('.datepicker .dia').click(function() {
			$('.calendario ').toggle("slow");
		});

	}

	$(window).scroll(function () {
		if ($(this).scrollTop() > 85) {
			$('.hora').css("top" ,$(this).scrollTop() - 28 +"px");
			$('.datepicker').css("top" ,$(this).scrollTop() - 28 +"px");
		} else {
			$('.hora').css("top" ,"0px");
			$('.datepicker').css("top" ,"0px");
		}
	});


	//=====================
	// GRADE
	//=====================

	function initGrade() {
		ajax('horaServer');
		getMoreProg();
	}

	function montaCanais(data){
		var canal = data, html_canal = "", canais;
		
		Variaveis.canais_id = "";
		Variaveis.canais_li = [];

		for(var i in canal){
			
			canais = canal[i];

			Variaveis.canais_id   += 'id_revel:'+ Variaveis.id_cidade +'_' + canais.id_canal +'+';
			Variaveis.canais_li.push(parseInt(canais.id_canal));
			Variaveis.canais_nome[canais.id_canal] = Utils.slug(canais.nome) ;

			html_canal +=  '<li>\
			<a href="grade/programa?canal='+ Utils.slug(canais.nome) +'_'+ canais.id_canal +'" title="'+canais.nome+'">\
			<div class="channel-logo">\
			<img alt="'+ canais.nome +'" src="https://www.netcombo.com.br/imagens/logo/'+ canais.nome +'-'+canais.id_canal+'_95x39.png">\
			</div>\
			<span class="channel-number"> '+canais.cn_canal+'</span>\
			</a>\
			</li>';
		}

		$('.canal_lista').append(html_canal);
		ajax('listaCanais','callbackShows');
	}

	// 
	// Remove programas vindo duplicado do Solr
	// 

	function removeProg(data) {

		var programas = data,  array =[], inc_1 = 0, inc_2 = 0;

		for(var i in programas){

			if(programas[inc_1] !== undefined && programas[inc_1 + 1] !== undefined && programas[inc_1].dh_inicio !== programas[inc_1 + 1].dh_inicio || (programas.length -1) == i){ //  (programas.length -1) == i para pegar o ultimo item

				array[inc_2] = programas[inc_1];
				inc_2++;
			}

			inc_1++;
		}

		formataJson(array);
	}


	function formataJson(data) {
		// console.log('formataJson 1' , array);
	
		var programas = data, programa, array = new Array(), inc_1 = 0, filho = true, prox_programa = 0, prox = 0, duracaoTotal = 0;
		// console.log('formataJson 2' , array);
		// console.log('formataJson 1' , data);

		for(var i in programas){


			programa = programas[i];
			// console.log('programa ',programa);
			programa.duracao = duracao(programa.dh_inicio, programa.dh_fim); 
			programa.periodo = formatPeriod(programa.dh_inicio) +' - '+ formatPeriod(programa.dh_fim);
			


			if((array[inc_1 - 1]) !== undefined && array[inc_1 - 1].id_canal == programa.id_canal && programa.duracao < 30 && duracaoTotal < 30 || (array[inc_1 - 1]) !== undefined && array[inc_1 - 1].id_canal == programa.id_canal && programa.duracao < 10){
				
				if((array[inc_1 - 1]) !== undefined){
					array[inc_1 - 1].mais_canais.push(programa);
					array[inc_1 - 1].width = width(array[inc_1 - 1].dh_inicio, programa.dh_fim, 'largura'); 
				}
				
				duracaoTotal += programa.duracao;

				// console.log(i+' array1 ', programa.duracao, ' >> ',(array[inc_1 - 1]) !== undefined ,  ' >> ', programa.duracao < 30 , ' >> ', duracaoTotal < 30 || (array[inc_1 - 1]) !== undefined , ' >> ',  programa.duracao < 10);

			}else{
				
				// console.log(i+' array2 ', programa.duracao, ' >> ',(array[inc_1 - 1]) !== undefined , ' >> ', programa.duracao < 30 , ' >> ', duracaoTotal < 30 || (array[inc_1 - 1]) !== undefined , ' >> ', programa.duracao < 10);
				
				programa.width = width(programa.dh_inicio, programa.dh_fim, 'largura'); 
				array[inc_1] =   programa;
				array[inc_1].mais_canais = [];
				filho = true;
				inc_1++;
				prox_programa = 0;
				duracaoTotal = programa.duracao;

				
			}
			prox++;
		}


		function groupBy( array , f ){
			var groups = {}, resultado = {};

			array.forEach( function( o ){
				var group = JSON.stringify( f(o) );
				groups[group] = groups[group] || [];
				groups[group].push( o );
				var x = parseInt(o.id_canal);
				resultado[x] =  groups[group];				
			
			});

			return resultado;

		}

		var result = groupBy(array, function(item){
			return item.id_canal;
		});

		// agrupa os programas com id_programa
		function groupBy( array , f ){
			var groups = {}, retorno = {};

			array.forEach( function( o ){
				var group = JSON.stringify( f(o) );
				groups[group] = groups[group] || [];
				groups[group].push( o );
				var x = parseInt(o.id_canal);
				retorno[x] =  groups[group];				
			
			});

			return retorno;

		}

		var result2 = groupBy(array, function(item){
			return item.id_canal;
		});

		// Ordena os canais
		var result = Variaveis.canais_li.map(function(i) {
			return  result2[i];
		});

		programacao(result);
	}

	function programacao(data) {


		var programas1 = data, programas2, programa, html ="", id_canal = "";

		for(var i in programas1){

			programas2 = programas1[i];


			if(programas2 == undefined){
				programas2 = [{id_canal: "0", st_titulo: "", dh_inicio: Variaveis.dia+"T00:00Z", dh_fim: Variaveis.dia+"T01:00Z", mais_canais:[], width: "style='width: 100%'", titulo: "Programação não disponível"}];
			}

			for(var i in programas2){
				programa = programas2[i];

				if(id_canal !== programa.id_canal && id_canal != ''){
					html += '</ul></li>';
				}

				if(id_canal == "" || id_canal !== programa.id_canal){

					html += '<li class="prog_canal '+ programa.id_canal +'"><ul>';
					html += inicioCanal(programa.dh_inicio);

				}
				var url = 'grade/programa?canal='+ Variaveis.canais_nome[programa.id_canal] +'_'+ programa.id_canal +'&prog='+ Utils.slug(programa.titulo) +'_' +programa.id_programa;

				html += '<li class="prog_programacao '+ programa.id_canal +'" '+programa.width+'><div>';
				html += '<a href="'+ url +'" title="'+programa.titulo+'">\
				<p><strong class="title">'+programa.titulo+'</strong></p>\
				<p><span class="period">  '+ programa.periodo +'</span></p>\
				</a>';

				if( programa.mais_canais !== undefined && programa.mais_canais[0] !== undefined ){

					html += '<div class="more-container"><div class="btn-more"> + Programas</div><ul class="more-list">';

					for (var ii = 0; ii < programa.mais_canais.length; ii++) {

						if(programa.mais_canais[ii].titulo !== ''){  

							var programa_mais = programa.mais_canais[ii];

							html += '<li class="more-item">\
							<a href="#" class="more-info">\
							<p><strong class="title">'+programa_mais.titulo+'</strong></p>\
							<p><span class="period">'+programa_mais.periodo+'</span></p>\
							</a>\
							</li>';
						} 
					}

					html +='</ul></div>';
				}
				id_canal = programa.id_canal;
			}

		}

		$('.prog_lista').append(html);
		showMore();
	}

	//  
	//  Recebe data e hora de inicio e fim dos programas e calcula o 
	//  tempo de duração até 23:59 do dia corrente o periodo que passa é iguinorado
	//  

	function duracao(ini, fim) {
		var progIni, progFim, tempo;
		
		progIni = moment.utc(ini);
		progFim = moment.utc(fim);

		if(Variaveis.diaSeguinte > progFim ){
			return  progFim.diff(progIni, 'minutes');			
		}else{
			return  Variaveis.diaSeguinte.diff(progIni, 'minutes');
		}	
	}

	function linhaTempo(data) {

	var posicao =  width( data, 0),
	largura = $(".scroll").width()/2,
		xpto = posicao -  largura; //centralizar grade no hr

		$('.prog').prepend('<div class="now-marker" style="left: '+ posicao +'px"></div>');
		$('.prog').css("left", '-'+ xpto +'px');
	}

	function width(ini, fim, tipo) {

		var progIni, progFim, tempo;

		progIni = moment.utc(ini);
		progFim = moment.utc(fim);


		if(Variaveis.diaSeguinte > progFim ){

			tempo =  progFim.diff(progIni, 'minutes');

		}else{

			tempo =  Variaveis.diaSeguinte.diff(progIni, 'minutes');
		}

		if(tipo == 'largura'){

			tempo = 'style="width: '+tempo * 5.5+'px"';

		}else{

			var diff = progIni.diff(Variaveis.diaZeroHora, 'minutes'); 
			tempo = diff  * 5.5;
		}

		return tempo
	}

	// 
	// Coloca uma espaço em branco caso o primeiro 
	// programa do canal inicie depois das 00:00
	// 

	function inicioCanal(data){

		var progIni, progFim, tempo;		
		progIni = moment.utc(data);

		if(Variaveis.diaZeroHora.diff(progIni, 'minutes')){
			return '<li class="prog_programacao" '+ width(Variaveis.diaZeroHora, progIni, 'largura') +'></li>';
		}else{
			return '';
		}
	}

	function formatPeriod(hora){
		hora = hora.toString().split('T')[1].substring(0,5);
		return hora;
	}

	function showMore(){
		$('.btn-more').click(function() {
			$( this ).parent('.more-container').toggleClass('active');
		})
	}	

	function getMoreProg(){
		$('#maisCanais .btn').click(function() {
			Variaveis.rowsStart = Variaveis.rowsStart + Variaveis.rows ;
			ajax('listaCanais','callbackChannels');
		})
	}

	$(".prog").draggable({ 
		axis: "x",
		cursor: "defaulf",
		addClasses: false,
		stop: function( event, ui ) {
			var larguraPai = $(".scroll").width(), 
			larguraFilho = $(".prog").width();
			if($(".prog").position().left > 1){
				$(".prog").css("left", "0px");
			}else if($(".prog").position().left < larguraPai - larguraFilho){
				$(".prog").css("left", larguraPai - larguraFilho+"px");
			}
		}
	});


	return {
		initGrade : initGrade
	};

}(jQuery));

GradePorgramacao.initGrade();