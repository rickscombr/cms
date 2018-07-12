$(".mapa-do-site" ).on( "click", function() {
	$('.mapa-do-site .icon-down').toggleClass('up');
	$('.sub-menu').fadeToggle( "700", "linear" );
});


function year(){
	var newYear = new Date().getFullYear();
	$("#currentYear").text(newYear);
}

year();