odoo.define('theme_prime.frontend', function (require) {
'use strict';

require('web.dom_ready');
var config = require('web.config');

// Enable bootstrap tooltip
$('[data-toggle="tooltip"]').tooltip({
    delay: {
        show: 100,
        hide: 100,
    },
});

var isMobileTablet = config.device.size_class <= config.device.SIZES.MD;

// Back to top button
if (!isMobileTablet) {
    var $backToTopButton = $('.back-to-top');
    $(window).scroll(function() {
        ($(this).scrollTop() > 800) ? $backToTopButton.fadeIn(400) : $backToTopButton.fadeOut(400);
    });
    $backToTopButton.click(function(ev) {
        ev.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        return true;
    });
}

if (isMobileTablet) {
    if (!$('footer').length) {
        // Portal Fix (Payment button)
        $('.tp-tablet-hide-bottom-reached').slideUp();
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            $('.tp-tablet-hide-bottom-reached').slideUp();
        } else {
            $('.tp-tablet-hide-bottom-reached').slideDown();
        }
    });
}

// Open dropdown on mouse over
if (!isMobileTablet) {
    var timeOutList = {};
    var SELECTORS = [
        '.tp_preheader .dropdown',
        '.tp_header .dropdown:not(.o_wsale_products_searchbar_form):not(.d_search_categ_dropdown)',
        'header .tp-account-info .dropdown',
        'body:not(.editor_enable) header #top_menu > .nav-item.dropdown',
        'footer .dropdown',
    ].join(',');
    $(document).on('mouseover', SELECTORS, function () {
        var $menu = $(this);
        clearTimeout(timeOutList[$menu.index()]);
        $menu.find('> .dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    });
    $(document).on('mouseout', SELECTORS, function () {
        var $menu = $(this);
        clearTimeout(timeOutList[$menu.index()]);
        $menu.find('> .dropdown-menu').stop(true, true).delay(200).fadeOut(500);
        timeOutList[$menu.index()] = setTimeout(function () {
            $menu.find('> .dropdown-menu').css('display', '');
        }, 710);
    });
}

});

odoo.define('theme_prime.menu.2', function (require) {
    'use strict';
    var core = require('web.core');
    require('web.dom_ready');

    var $Menu2 = $('.d_custom_menu_2');
    if ($Menu2.length) {
        var lastItem = $('.d_custom_menu_2').find('.nav-item:last');
        if (lastItem.length) {
            lastItem.addClass('ml-auto');
        }
    }

});
