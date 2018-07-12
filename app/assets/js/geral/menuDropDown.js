var MenuDropDown = (function($) {
    'use strict';


    //=====================
    // SELECTORS
    //=====================

    var selectors = {
        containerMenu: '.container-menu-drop-dow',
        containerMenuUl: '.container-menu-drop-dow ul',
        navSubmenuBox: '.nav-submenu-box',
        targetMenuDropDown: '.menu-drop-dow'
    };


    //=====================
    // VAR
    //=====================

    var startDropDown = 0;


    //=====================
    // EVENTS
    //=====================

    function dropDownGeneralMenu(e) {
        e.preventDefault();

        startDropDown = 1;

        if ($window.width() >= 1025 && startDropDown == 1) {

            $(this).closest(selectors.containerMenu).toggleClass('show-menu-drop-down');

            $(document).keyup(function(e) {
                if (e.keyCode === 27 && startDropDown == 1) {
                    $(selectors.containerMenu).removeClass('show-menu-drop-down');

                    return startDropDown = 0;
                }
            });
        }

    }

    function focusOut(e) {
        e.preventDefault();

        $(selectors.containerMenu).removeClass('show-menu-drop-down');
    }


    var submenu = $(".submenu-active");

    function activateSubmenu() {

        submenu.click(function(e) {
            deactivateSubmenu();

            //e.stopPropagation();

            var thisID = $(this).attr('data-submenu-id');

            $('#' + thisID).show().addClass("active-hover");

        });
    }
    activateSubmenu();


    function deactivateSubmenu(e) {
        $(".popover").removeClass("active-hover").css("display", "none");
    }


    $(".submenu-active .btn-close-submenu").click(function() {
        $(this).parent().fadeOut();
    });


    //=====================
    // HELPERS
    //=====================	

    // CLICK FECHA 
    /*function closeMenu(){
    	closeSubMenu()
    	closeOverlay()
    	
    	$( Selectors.menu ).animate({ 'left':'-100%' }, 'slow' );

    	return false;
    }*/


    //=====================
    // RETURN
    //=====================

    return {
        focusOut: focusOut,
        selectors: selectors,
        dropDownGeneralMenu: dropDownGeneralMenu,
        activateSubmenu: activateSubmenu,
        deactivateSubmenu: deactivateSubmenu
    };
}(jQuery));