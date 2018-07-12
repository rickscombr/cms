var MenuMobile = (function($) {
    'use strict';

    //=====================
    // SELECTORS
    //=====================

    var Selectors = {
        navEvent: '#collapse',
        nav: '#m-nav-menu',
        navClose: '#collapse-close',
        bodys: 'body',
        scroll: '.m-scrolling',
        menuItem: '.m-menu-item',
        categoryEvent: '#submenu-category',
        categoryTarget: '.m-header-submenu',
        categoryActive: '.icon-toggle',
        cityEvent: '#box-city',
        cityBox: '.aside-city',
        cityClose: '.aside-close'
    };


    function blockScroll() {
        $(Selectors.bodys).addClass('locked');
    }

    function unBlockScroll() {
        $(Selectors.bodys).removeClass('locked');
    }

    function animateOpenNav() {
        $(Selectors.nav).animate({ 'left': '0px' }, 300);
    }

    function animateCloseNav() {
        $(Selectors.nav).animate({ 'left': '-100%' }, 300);
    }

    function scrollTop() {
        $(Selectors.scroll).animate({ scrollTop: 0 }, 'fast');
    }

    function openNav() {
        $(Selectors.navEvent).on('click', function(e) {
            e.preventDefault();
            animateOpenNav();
            blockScroll();
        });
    }

    function closeNav() {
        $(Selectors.navClose).on('click', function(e) {
            e.preventDefault();

            scrollTop();
            animateCloseNav();
            unBlockScroll();
        });
    }

    function positionSwipeMenu() {
        var w = $(".m-menu-item.title").outerWidth();
        $(Selectors.menuItem).eq(1).animate({ "padding-left": w + 15 }, 50);
    }

    function resize() {
        $(window).resize(function() {
            if ($(window).outerWidth() <= 1023) {
                positionSwipeMenu();
            }
        });
    }


    function menuCategory() {
        $(Selectors.categoryEvent).click(function(e) {
            $(Selectors.categoryTarget).slideToggle("slow");
            $(Selectors.categoryActive).toggleClass('active');
        });
    }


    function blockCity() {
        $(Selectors.cityEvent).click(function() {
            $(Selectors.cityBox).animate({ 'height': '100%' }, 600);

            scrollTop();
            animateCloseNav();
            blockScroll();
        });
    }

    function blockCityClose() {
        $(Selectors.cityClose).click(function() {
            $(Selectors.cityBox).animate({ 'height': '0' }, 400);
            unBlockScroll();
        });
    }


    function closeDefaultelements() {
        $(document).mouseup(function(e) {
            var container = $(".m-header-submenu");

            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
            }
        });
    }


    positionSwipeMenu();
    menuCategory();
    openNav();
    closeNav();
    blockCity();
    blockCityClose();
    resize();

    //=====================
    // RETURN
    //=====================

    return {
        openNav: openNav,
        closeNav: closeNav,
        positionSwipeMenu: positionSwipeMenu,
        menuCategory: menuCategory,
        blockCity: blockCity,
        blockCityClose: blockCityClose,
        resize: resize
    };
}(jQuery));