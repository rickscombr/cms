/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'IconesNetCombo\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-youtube_footer' : '&#xe000;',
			'icon-facebook_footer' : '&#xe001;',
			'icon-twitter_footer' : '&#xe002;',
			'icon-estrela' : '&#xe02d;',
			'icon-mensagem_sucesso' : '&#xe02c;',
			'icon-gravar_ball' : '&#xe02b;',
			'icon-mensagem_erro' : '&#xe02a;',
			'icon-tv' : '&#xe029;',
			'icon-internet' : '&#xe028;',
			'icon-fone' : '&#xe027;',
			'icon-fone_borda' : '&#xe018;',
			'icon-internet_borda' : '&#xe017;',
			'icon-tv_borda' : '&#xe016;',
			'icon-now_em_casa' : '&#xe026;',
			'icon-preco_now' : '&#xe025;',
			'icon-seta_up2' : '&#xe024;',
			'icon-seta_down2' : '&#xe023;',
			'icon-saiba_mais' : '&#xe022;',
			'icon-fechar' : '&#xe020;',
			'icon-documento' : '&#xe012;',
			'icon-planos' : '&#xe003;',
			'icon-minhaarea_over' : '&#xe004;',
			'icon-notebook' : '&#xe005;',
			'icon-devices' : '&#xe006;',
			'icon-controle_remoto' : '&#xe007;',
			'icon-gravar' : '&#xe008;',
			'icon-concluido' : '&#xe009;',
			'icon-navegacao' : '&#xe00a;',
			'icon-grade_bola' : '&#xe00b;',
			'icon-Facebook' : '&#xe00c;',
			'icon-twitter' : '&#xe00d;',
			'icon-local' : '&#xe00e;',
			'icon-buscar' : '&#xe00f;',
			'icon-seta_avancar' : '&#xe010;',
			'icon-seta_voltar' : '&#xe011;',
			'icon-seta_down' : '&#xe013;',
			'icon-seta_up' : '&#xe014;',
			'icon-lupa' : '&#xe015;',
			'icon-minhaarea' : '&#xe019;',
			'icon-seta_carrossel_dir' : '&#xe01a;',
			'icon-seta_carrossel_esq' : '&#xe01b;',
			'icon-ola' : '&#xe01c;',
			'icon-paper' : '&#xe01d;',
			'icon-relogio' : '&#xe01e;',
			'icon-grade' : '&#xe01f;',
			'icon-calendario' : '&#xe021;',
			'icon-smartphone_borda' : '&#xe02e;',
			'icon-ipad_borda' : '&#xe02f;',
			'icon-notebook_borda' : '&#xe030;',
			'icon-dicas_seguranca_borda' : '&#xe031;',
			'icon-guia_borda' : '&#xe032;',
			'icon-controle_borda' : '&#xe033;',
			'icon-configuracao' : '&#xe034;',
			'icon-ferramenta' : '&#xe035;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};