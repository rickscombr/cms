;(function( undefined ) {
  'use strict';

  require.config({
    waitSeconds: 0,
    packages:[
      { name:'carrosselVideo', location: '../js/components/carrosselVideo' },
      { name:'inject', location: '../js/components/inject' },
      { name:'painelAbas', location: '../js/components/painelAbas' },
      { name:'accordion', location: '../js/components/accordion' },
      { name:'zigZagEqualize', location: '../js/components/zigZagEqualize' },
      { name:'zigZagLinear', location: '../js/components/zigZagLinear' },
      { name:'bannerCarrossel', location: '../js/components/bannerCarrossel' },
      { name:'mosaico', location: '../js/components/mosaico' },
      { name:'carrosselPadrao', location: '../js/components/carrosselPadrao' },
      { name:'roamingBuscaPaises', location: '../js/components/roamingBuscaPaises' },
      { name:'destaqueAssinante', location: '../js/components/destaqueAssinante' },
      { name:'destaqueCanais', location: '../js/components/destaqueCanais' },
      { name:'payPerView', location: '../js/components/payPerView' },
      { name:'bannerCapas', location: '../js/components/bannerCapas' },
      { name:'carrosselPreview', location: '../js/components/carrosselPreview' },
      { name:'carrosselTitulo', location: '../js/components/carrosselTitulo' },
      { name:'carrosselPadrao', location: '../js/components/carrosselPadrao' },
      { name:'gradeProgramacao', location: '../js/components/gradeProgramacao' },
      { name:'gradeDetalhe', location: '../js/components/gradeDetalhe' },
      { name:'galeriaMosaico', location: '../js/components/galeriaMosaico' },
      { name:'trackGtm', location: '../js/components/trackGtm' },
      { name:'adultos', location: '../js/components/porteira-adultos' },
      { name:'parallax', location: '../js/components/parallax' },
      { name:'abasVerticais', location: '../js/components/abasVerticais' },
      { name:'bannerVitrine', location: '../js/components/bannerVitrine' }

    ]
  });

  require(['inject'], function( $ ) {
  });
})();
