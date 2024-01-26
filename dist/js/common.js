/* Variables */
const openMenuBtn = $('.js-open-menu');
const header = $('.js-header');
const menuItem = $('.js-menu-list a');
const bodyEl = $('body');
let headerHeight = 90;

const r = document.querySelector(':root');
const rs = getComputedStyle(r);

/* Header animation */
const scrollFunction = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        header.addClass("sticky");
        r.style.setProperty('--logo-height', '70px');
        headerHeight = parseInt(rs.getPropertyValue('--logo-height'), 10) + 20

    } else {
        header.removeClass("sticky");
        r.style.setProperty('--logo-height', '120px');
        headerHeight = parseInt(rs.getPropertyValue('--logo-height'), 10) + 20
    }
};

$(window).on('scroll', scrollFunction);

/* Events */

/* Mobile menu toggle*/
let windowWidth = $(window).width();

function toggleMenu() {
    windowWidth = $(window).width();

    if (windowWidth < 992){
        bodyEl.toggleClass('menu-opened');
    }
}

openMenuBtn.on('click', toggleMenu);
menuItem.on('click', toggleMenu);

/* Animate Anchor Menu */
$(".js-menu-link").on('click', function() {
    const t = $(this).attr("href");

    $("html, body").animate({
        scrollTop: $(t).offset().top - headerHeight
    }, {
        duration: 300,
    });
    bodyEl.scrollspy({ target: '.header', offset: $(t).offset().top });
});

/* Animate Content */
AOS.init({
    offset: 0,
    delay: 0,
    duration: 1200,
    easing: 'ease',
    once: true,
    mirror: false,
    disable: "mobile"
});