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
		canais_nome		: [],
		canais_li 		: [], // para ordenar a lista na mesma ordem que foi feita, coisa que o Solr deveria fazer...
		id_cidade		: '1', // id da cidade regionalizada
		ordenaCanais    : 'asc', // ordenação dos canais da grade... desc ou asc
		ordemCampo		: 'cn_canal',
		rows            : 1, // numero de canais a cada interação
		rowsStart       : 0, // start da lista de canais
		rowsBusca		: '10', // numero de resultados do campo busca
		canalNome       : '',
		filtroBusca       : '',
		id_categoria	: '' ,
		id_canal		: '',
		progAtivo		: '',
		progAtivoHr		: '',
		programaExibicoes		: '',
		nomeCanal	: '' 
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
				
				// var url = 'https://programacao.netcombo.com.br/gatekeeper/canal/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackChannels&json.wrf=callbackChannels&wt=json&rows=' + Variaveis.rows + '&start=' + Variaveis.rowsStart + '&sort=' + Variaveis.ordemCampo + ' '+ Variaveis.ordenaCanais +'&fl=id_canal:'+ Variaveis.id_canal +' st_canal cn_canal nome&fq=nome:' + Variaveis.canalNome + '*'+ id_categoria +'&_=' +Variaveis.timeServer;
				var url = 'https://programacao.netcombo.com.br/gatekeeper/canal/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackChannels&json.wrf=callbackChannels&wt=json&rows=' + Variaveis.rows + '&sort=cn_canal asc&fl=id_canal st_canal cn_canal nome&fq=nome:*&fq=id_canal:'+ Variaveis.id_canal +'&_=' +Variaveis.timeServer;

			}else if(callback == 'callback'){
				
				var url = 'https://programacao.netcombo.com.br/gatekeeper/prog/select?q='+ Variaveis.filtroBusca +'*&callback=callback&start=0&rows=20&wt=json&fl=titulo+descricao+st_titulo+id_programa&json.wrf=callback&_=' +Variaveis.timeServer;

			}else if(callback == 'callbackShowNowOn'){

				var url ='https://programacao.netcombo.com.br/gatekeeper/prog/select?q=id_programa:'+ Variaveis.progAtivo +'&callback=callbackShowNowOn&json.wrf=callbackShowNowOn&wt=json&rows=1&_='+Variaveis.timeServer;

			}else if(callback == 'callbackExhibitions'){
				
				if(window.location.href.split('&prog=').length == 2){				
					var url ='https://programacao.netcombo.com.br/gatekeeper/exibicao/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackExhibitions&json.wrf=callbackExhibitions&wt=json&rows=20&sort=dh_inicio asc&fl=dh_inicio st_titulo titulo id_programa id_canal fl_ppv id_exibicao&fq=dh_inicio:['+ moment(Variaveis.timeServer).format('YYYY-MM-DD[T]HH:mm:ss[Z]') +' TO '+ moment(Variaveis.timeServer).add(30, 'days').format('YYYY-MM-DD[T]HH:mm:ss[Z]') +']&fq=id_programa:'+ Variaveis.progAtivo +'&_='+Variaveis.timeServer;

				}else{
					var url ='https://programacao.netcombo.com.br/gatekeeper/exibicao/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackExhibitions&json.wrf=callbackExhibitions&wt=json&rows=20&sort=dh_inicio asc&fl=dh_inicio st_titulo titulo id_programa id_canal fl_ppv id_exibicao&fq=dh_inicio:['+ moment(Variaveis.timeServer).format('YYYY-MM-DD[T]HH:mm:ss[Z]') +' TO '+ moment(Variaveis.timeServer).add(30, 'days').format('YYYY-MM-DD[T]HH:mm:ss[Z]') +']&fq=id_canal:'+ Variaveis.id_canal +'&_='+Variaveis.timeServer;
					
				}

			}else if(callback == 'callbackNextExhibitions'){

				var url ='https://programacao.netcombo.com.br/gatekeeper/exibicao/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackNextExhibitions&json.wrf=callbackNextExhibitions&wt=json&rows=4&sort=dh_inicio asc&fl=dh_inicio st_titulo titulo id_programa id_exibicao&fq=dh_inicio:['+ moment(Variaveis.timeServer).format('YYYY-MM-DD[T]HH:mm:ss[Z]') +' TO '+ moment(Variaveis.timeServer).add(30, 'days').format('YYYY-MM-DD[T]HH:mm:ss[Z]') +']&fq=id_canal:'+ Variaveis.id_canal +'&_='+Variaveis.timeServer;

			}else if(callback == 'callbackNowOn'){

				var url ='https://programacao.netcombo.com.br/gatekeeper/exibicao/select?q=id_cidade:1&callback=callbackNowOn&json.wrf=callbackNowOn&wt=json&rows=1&sort=dh_inicio asc&fl=id_programa dh_inicio dh_fim&fq=id_canal:'+ Variaveis.id_canal +'&fq=dh_fim:['+ moment(Variaveis.timeServer).format('YYYY-MM-DD[T]HH:mm:ss[Z]') +' TO '+ moment(Variaveis.timeServer).add(1, 'days').format('YYYY-MM-DD[T]HH:mm:ss[Z]') +']&_='+Variaveis.timeServer;

			}else if(callback == 'callbackShows'){		

				var	url = 'https://programacao.netcombo.com.br/gatekeeper/exibicao/select?q='+ Variaveis.canais_id +'&callback=callbackShows&json.wrf=callbackShows&wt=json&rows=100000&sort=id_canal asc,dh_inicio asc&fl=dh_fim dh_inicio st_titulo titulo id_programa id_canal&fq=dh_inicio:['+ Variaveis.dia +'T00:00:00Z TO '+ Variaveis.dia+'T23:59:00Z]';

			}else{
				return false;
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
						}else{
							$('.sem-resultado').show();
						}
					}else if(callback == 'callback'){
						resutadoBusca(data.response.docs);

					}else if(callback == 'callbackShowNowOn'){

						getDetalheProgramaAtivo(data.response.docs[0]);

					}else if(callback == 'callbackExhibitions'){

						getExibicoes(data.response.docs);

					}else if(callback == 'callbackNextExhibitions'){

						getAseguir(data.response.docs);

					}else if(callback == 'callbackNowOn'){

						callbackNowOn(data.response.docs);

					}else if(callback == 'callbackShows'){
						//
						//prepara json removendo programas duplicados 
						//
						removeProg(data.response.docs);

					}
				}			
			});
			console.log(encodeURI(url));

		}
	}


	function getDetalheCanal(){
		$.ajax({
			url: 'http://programacao.netcombo.com.br/gatekeeper/desccanal/select?q=id_canal:'+ Variaveis.id_canal +'&fl=cn_descricao&wt=json',
		}).done(function(data) {
			$('.canal h3').html(data.response.docs[0].cn_descricao);
		});

	}
	function callbackNowOn(data){
		Variaveis.progAtivo = data[0].id_programa;
		Variaveis.progAtivoHr = formatPeriod(data[0].dh_inicio) +' - '+ formatPeriod(data[0].dh_fim);
	}

	function getDetalheProgramaAtivo(data){
		var html_canal ="";

		html_canal += 	'<h2 class="titulo">'+ data.titulo +'</h2>\
		<span class="hora">'+ Variaveis.progAtivoHr +'</span>  \
		<div class="descricao">'+ data.descricao +'</div>';
		
		if(data.elenco != undefined){
			html_canal += 	'<div class="elenco">Elenco: '+ data.elenco +'</div>';			
		}

		if(data.diretor != undefined){
			html_canal += 	'<div class="diretor">Diretor: '+ data.diretor +'</div>';
		}

		html_canal += 	'<div class="detalhes">\
						<h5>'+ data.genero +'&nbsp;&nbsp;|&nbsp;&nbsp;'+ data.duracao +' min&nbsp;&nbsp;|&nbsp;&nbsp;<span class="canal">'+ data.censura +'</span></h5>\
						</div>';


		$('.programa').html(html_canal);
		$('.prog_canal .prog_'+Variaveis.progAtivo).addClass('ativo');


	}

	function getAseguir(data){
		var html = '', programa, programas = data, hr ='';

		for(var i in programas){
			programa = programas[i];
			hr =  programa.dh_inicio.split('T');

			if(i == 0){
				html +=	'<li>A seguir no canal '+ Variaveis.canalNome +'</li>\
						 <li  class="ativo"><span>'+ hr[1].substring(0,5) +'</span>'+ programa.titulo +'</li>';
				
			}else{
				html +=	'<li><span>'+ hr[1].substring(0,5) +'</span>'+ programa.titulo +'</li>';
			}
		}
		ajax('listaCanais','callbackShowNowOn');
		$('.seguir ul').html(html);
	}


	function getExibicoes(data){
		var programas = data, programa, html = '', dia ="";

		if(data.length < 7){
			$('.exibicoes .mais').hide();
		}


		for(var i in programas){
			
			programa = programas[i];
			//bah, no moment tah cacheando a data....
			dia =  programa.dh_inicio.split('-');

			if(i >= 6){
				html +=	'<li class="linha hide">';				
			}else{
				html +=	'<li class="linha">';				
			}
				html +=	'<ul>\
							<li>'+  dia[2].substring(0,2)+'/'+ dia[1]+'/'+ dia[0] +'</li>\
							<li>'+  formatPeriod(programa.dh_inicio) +'</li>';
							
							if(Variaveis.id_canal ==  programa.id_canal){
								html +=	'<li>'+ Variaveis.canalNome +'</li>';

							}else{
								html +=	'<li class="'+programa.id_canal+'">---</li>';
								Variaveis.programaExibicoes += ' id_canal:'+programa.id_canal;						
							}

							if(programa.fl_ppv == 0){
								html += '<li><a class="btn gravar" href="https://minhanet.net.com.br/webcenter/portal/NETAutoAtendimento/pages_agendamentogravacao?codigoPrograma='+ programa.id_programa +'&codigoExibicao='+ programa.id_exibicao +'">Gravar</a></li>';
							}else{
								html += '<li><a class="btn comp" href="https://minhanet.net.com.br/webcenter/portal/NETAutoAtendimento?codigoPrograma='+ programa.id_programa +'">Comprar programa</a></li>';

							}
				html +=	'</ul>\
					</li>';

		}

		if(Variaveis.programaExibicoes != ''){
			programaExibicoes(Variaveis.programaExibicoes);
		}

		$('.exibicoes ul').html(html);
	}
	function programaExibicoes(programaExibicoes){

		var url = 'https://programacao.netcombo.com.br/gatekeeper/canal/select?q=id_cidade:'+ Variaveis.id_cidade +'&callback=callbackChannels&json.wrf=callbackChannels&wt=json&rows=300&sort=id_canal asc&fl=id_canal st_canal cn_canal nome&fq='+ programaExibicoes +'&_=' +Variaveis.timeServer;
		
		$.getJSON({
			type: "GET",
			url: encodeURI(url),
			jsonpCallback: 'callbackChannels',
			dataType: "jsonp",
			cache: true,
			success: function(data) {
				for(var i in data.response.docs){
					$('.'+data.response.docs[i].id_canal).html(data.response.docs[i].nome);

				}
			}
		});

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
	function limpaGrade(){
		$('.canal_lista li').remove();
		$('.prog_lista li').remove();
	}

	//=====================
	// GRADE
	//=====================

	function initGrade() {
		Variaveis.id_canal = window.location.href.split('?canal=');
		Variaveis.id_canal = Variaveis.id_canal[1].split('_');
		Variaveis.id_canal = Variaveis.id_canal[1].split('&');
		Variaveis.id_canal = Variaveis.id_canal[0];		

		if(window.location.href.split('&prog=').length == 2){
			Variaveis.progAtivo = window.location.href.split('&prog=');
			Variaveis.progAtivo =  Variaveis.progAtivo[1].split('_');
			Variaveis.progAtivo =  Variaveis.progAtivo[1];
		}
		

		ajax('horaServer');
		getDetalheCanal();
	}

	function montaCanais(data){
		var canal = data, html_canal = "", canais;
		
		Variaveis.canais_id = "";
		Variaveis.canais_li = [];

		for(var i in canal){
			
			canais = canal[i];

			Variaveis.canais_id   += 'id_revel:'+ Variaveis.id_cidade +'_' + canais.id_canal +'+';
			Variaveis.canais_li.push(parseInt(canais.id_canal));
			Variaveis.canalNome = canais.nome;
			Variaveis.canais_nome[canais.id_canal] = Utils.slug(canais.nome) ;

			html_canal +=  '<li>\
			<a href="programa?canal='+ Utils.slug(canais.nome) +'_'+ canais.id_canal +'" title="'+canais.nome+'">\
			<div class="channel-logo">\
			<img alt="'+ canais.nome +'" src="https://www.netcombo.com.br/imagens/logo/'+ canais.nome +'-'+canais.id_canal+'_95x39.png">\
			</div>\
			<span class="channel-number"> '+canais.cn_canal+'</span>\
			</a>\
			</li>';
		}

		$('.canal_lista').append(html_canal);
		$('.canal h2').html(Variaveis.canalNome);
		ajax('listaCanais','callbackShows'); 
		ajax('listaCanais','callbackNextExhibitions');
		
		if(Variaveis.progAtivo == ''){
			ajax('listaCanais','callbackNowOn');			
		}
		ajax('listaCanais','callbackExhibitions');
		ajax('listaCanais','getProgramaAtivo');
		

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

		var programas = data, programa, array =[], inc_1 = 0, filho = true, prox_programa = 0, prox = 0, duracaoTotal = 0;


		for(var i in programas){


			programa = programas[i];
			programa.duracao = duracao(programa.dh_inicio, programa.dh_fim); 
			programa.periodo = formatPeriod(programa.dh_inicio) +' - '+ formatPeriod(programa.dh_fim);
			

			if((array[inc_1 - 1]) !== undefined && array[inc_1 - 1].id_canal == programa.id_canal && programa.duracao < 30 && duracaoTotal < 30 || (array[inc_1 - 1]) !== undefined && array[inc_1 - 1].id_canal == programa.id_canal && programa.duracao < 10){
				
				if((array[inc_1 - 1]) !== undefined){
					array[inc_1 - 1].mais_canais.push(programa);
					array[inc_1 - 1].width = width(array[inc_1 - 1].dh_inicio, programa.dh_fim, 'largura'); 
				}
				
				duracaoTotal += programa.duracao;


			}else{
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

				var url = 'programa?canal='+ Variaveis.canais_nome[programa.id_canal] +'_'+ programa.id_canal +'&prog='+ Utils.slug(programa.titulo) +'_' +programa.id_programa;

				html += '<li class="prog_programacao prog_'+ programa.id_programa +'" '+programa.width+'><div>';
				html += '<a href="'+ url +'" title="'+programa.titulo+'">\
				<p><strong class="title">'+programa.titulo+'</strong></p>\
				<p><span class="period">  '+ programa.periodo +'</span></p>\
				</p>';

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

		$('.exibicoes .mais').click(function(e) {
			e.preventDefault();
			$('.exibicoes .hide ').toggleClass('hide');
			$('.exibicoes .mais').hide();
		})


		return {
			initGrade : initGrade
		};

	}(jQuery));

GradePorgramacao.initGrade();