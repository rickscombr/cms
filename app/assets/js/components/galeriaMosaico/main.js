

var galeriaMosaico = (function() {
    'use strict';


    var Selectors = {
        video : '.galeria_mosaico .item'
    }


    function playVideo() {
        $(Selectors.video).hover(function() {
            $(this).find("video").get(0).play();
        }, function() {
            $(this).find("video").get(0).pause();
            $(this).find("video").get(0).currentTime = 0;
        })
    }

    function resize(){
        var width = $window.width();
        if(width < 650) {
            $('.galeria_mosaico .item .video').each(function() {
                var src = $( this ).attr('data-mobile');
                if(src !== undefined){
                    $(this).find("video").remove();
                    $(this).append("<video loop='loop' muted='muted'><source src='"+ src +"'/></video>");
                }
            });
        }else if(width < 1024){
            $('.galeria_mosaico .item .video').each(function() {
                var src = $( this ).attr('data-tablet');
                if(src !== undefined){
                    $(this).find("video").remove();
                    $(this).append("<video loop='loop' muted='muted'><source src='"+ src +"'/></video>");
                }
            });
        }
        playVideo();
   }

return {
    resize : resize
};

}(jQuery));

galeriaMosaico.resize();
