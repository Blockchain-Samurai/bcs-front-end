window.addEventListener('scroll', function(){
    var topbar = jQuery('.samurai_tm_topbar,.samurai_tm_topbar_single');
	var WinOffset = jQuery(window).scrollTop();

	if(WinOffset >= 100){
		topbar.addClass('animate');
	}else{
		topbar.removeClass('animate');
	}
});


// -------------------------------------------------
// -------------  LOAD FUNCTION  -------------------
// -------------------------------------------------
$(window).on('load', function(){
    preloader();
    setTimeout(function(){
		jQuery('.samurai_tm_topbar').addClass('opened');
	}, 1000);
});

// Wrap the native DOM audio element play function and handle any autoplay errors
Audio.prototype.play = (function(play) {
    return function () {
      var audio = this,
          args = arguments,
          promise = play.apply(audio, args);
      if (promise !== undefined) {
        promise.catch(_ => {
          // Autoplay was prevented.
            $('#audio-toggle').html(`<i id='audio-toggle-icon' class="fas fa-play-circle"></i>`);
            localStorage.setItem('BCS-audio-state',0);
        });
      } 
    };
    })(Audio.prototype.play);

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

    let state = parseInt(localStorage.getItem('BCS-audio-state'));
    let audio = $('#audio-container');

    if(state == null) 
    {
        localStorage.setItem('BCS-audio-state',1);
    } else if(state == 0) {
        $('#audio-toggle').html(`<i id='audio-toggle-icon' class="fas fa-volume-mute"></i>`);
    } else {
        $('#audio-toggle').html(`<i id='audio-toggle-icon' class="fas fa-volume-up"></i>`);
        audio[0].play();
    }

    $('#audio-toggle').click(function(){
        let state = parseInt(localStorage.getItem('BCS-audio-state'));
        let audio = $('#audio-container');

        if(state == 1){
            localStorage.setItem('BCS-audio-state', 0);
            $('#audio-toggle').html(`<i id='audio-toggle-icon' class="fas fa-volume-mute"></i>`);
            audio[0].pause();
        } else {
            localStorage.setItem('BCS-audio-state', 1);
            $('#audio-toggle').html(`<i id='audio-toggle-icon' class="fas fa-volume-up"></i>`);
            audio[0].play();
        }
    })
})

function preloader(){
    setTimeout(function(){
        $('.preloader').addClass('loaded');
    }, 100);
}

// -------------------------------------------------
// ------------  AUDIO FUNCTIONS  ------------------
// -------------------------------------------------

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
      y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x==c_name)
        {
        return unescape(y);
        }
      }
}

var song = $('#audio-container');
var played = false;
var tillPlayed = getCookie('timePlayed');
function update()
{
    let state = parseInt(localStorage.getItem('BCS-audio-state'));
    if(!played && state==1){
        if(tillPlayed){
        song[0].currentTime = tillPlayed;
        song[0].play();
        played = true;
        }
        else {
                song[0].play();
                played = true;
        }
    }

    else {
    setCookie('timePlayed', song[0].currentTime);
    }
}
setInterval(update,1000);

// Initialization of scrollbars throughout the project
if (typeof OverlayScrollbars !== 'undefined') {
    const tempScrolls = [];
    OverlayScrollbars(document.querySelectorAll('.scroll'), {
    scrollbars: {autoHide: 'leave', autoHideDelay: 600},
    overflowBehavior: {x: 'hidden', y: 'scroll'},
    });
    OverlayScrollbars(document.querySelectorAll('.scroll-map'), {
        scrollbars: {dragScrolling : true, autoHide: 'leave', autoHideDelay: 600},
        overflowBehavior: {x: 'scroll', y: 'scroll'},
    });
    OverlayScrollbars(document.querySelectorAll('.scroll-horizontal'), {
    scrollbars: {autoHide: 'leave', autoHideDelay: 600},
    overflowBehavior: {x: 'scroll', y: 'hidden'},
    });
    OverlayScrollbars(document.querySelectorAll('.data-table-rows .table-container'), {
    overflowBehavior: {x: 'scroll', y: 'hidden'},
    });
    OverlayScrollbars(document.querySelectorAll('.scroll-track-visible'), {overflowBehavior: {x: 'hidden', y: 'scroll'}});
    OverlayScrollbars(document.querySelectorAll('.scroll-horizontal-track-visible'), {
    overflowBehavior: {x: 'scroll', y: 'hidden'},
    });
    document.querySelectorAll('.scroll-by-count').forEach((el) => {
    if (typeof ScrollbarByCount === 'undefined') {
        console.log('ScrollbarByCount is undefined!');
        return;
    }
    let scrollByCount = new ScrollbarByCount(el, {sizeAutoCapable:false});
    });
}


function imagePreload(imageArray){
    imageArray.forEach(e => {
        let imgPreload = new Image();
        imgPreload.src = e.path;
        //check if the image is already cached:
        if (imgPreload.complete || imgPreload.readyState === 4) {
            //image loaded:
            //your code here to insert image into page
            $(e.id).css("background",`url(${imgPreload.src})`);
        } else {
            //go fetch the image:
            $(e.id).css("background",`url(${e.path})`);
        }
    });
}