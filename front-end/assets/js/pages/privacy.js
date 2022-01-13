$( document ).ready(function(){
    // -------------------------------------------------
	// -------------  LOAD FUNCTION  -------------------
	// -------------------------------------------------
	
	$(window).on('load', function(){
        preloader();
        setTimeout(function(){
			jQuery('.samurai_tm_topbar').addClass('opened');
		}, 1000);
    });
});

window.addEventListener('scroll', function(){
    var topbar = jQuery('.samurai_tm_topbar,.samurai_tm_topbar_single');
	var WinOffset = jQuery(window).scrollTop();

	if(WinOffset >= 100){
		topbar.addClass('animate');
	}else{
		topbar.removeClass('animate');
	}
});


$(function() {

    var hamburger = $('.hamburger');
	var mobileMenu = $('.samurai_tm_mobile_menu .dropdown');
	
	hamburger.on('click',function(){
		var element = $(this);
		
		if(element.hasClass('is-active')){
			element.removeClass('is-active');
			mobileMenu.slideUp();
		}else{
			element.addClass('is-active');
			mobileMenu.slideDown();
		}
		return false;
	});
})

function preloader(){
    setTimeout(function(){
        $('.preloader').addClass('loaded');
    }, 100);
}