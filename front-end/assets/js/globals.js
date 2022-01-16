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

$(async function() {
    await isLoggedIn().then(res => {
        buildUser(res);
    }).catch(err => {
        console.log(err);
        buildLogin();
    });

    var hamburger = $('.hamburger');
	var mobileMenu = $('.samurai_tm_mobile_menu .dropdown');
	let page_year = $('#page-year');
    page_year.html(new Date().getFullYear());

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
    });
})

function preloader(){
    setTimeout(function(){
        $('.preloader').addClass('loaded');
    }, 100);
}

// -------------------------------------------------
// -------------  AUTH FUNCTIONS  ------------------
// -------------------------------------------------

async function isLoggedIn(){
    return new Promise(function(res,rej){
        jQuery.ajax({
            //url: "http://127.0.0.1:5501/front-end/temp_data/api-user-profile.json",
            url: "https://blockchainsamurai.io/api/user/profile",
            method: "GET",
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
}

async function logUserOut(){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: "https://blockchainsamurai.io/api/auth/logout",
            method: "GET",
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
}


$(document.body).on('click', '.oauth-logout',async function(event){
    console.log('AHHH')
    event.stopPropagation();
    event.stopImmediatePropagation();
    await logUserOut().then(res => {
        window.location.replace("https://blockchainsamurai.io/");
    }).catch(err => {
        console.log(err);
    });
});

function buildUser(user){
    const oauth_container = $('#oauth-login-container');
    const oauth_container_mobile = $('#oauth-login-container-mobile');
    let prof_pic = user.avatar;
    let user_profile_mobile;
    let user_profile;
    if(prof_pic == null) {
        prof_pic = "assets/images/default.jpg";
    }
    if(user.role == 2) {
        user_profile = `
        <div class="btn-group">
            <img src="assets/images/default.jpg" data-src="${prof_pic}" class="rounded-circle lazyload" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="profile.html"><i class="fas fa-user text-muted mr-3"></i> Profile</a>
                <a class="dropdown-item" href="admin.dashboard.html"><i class="fas fa-tools text-muted mr-3"></i> Admin</a>
                <div class="dropdown-divider"></div>
                <a class="oauth-logout dropdown-item" href="#"><i class="fas fa-sign-out-alt text-muted mr-3"></i> Logout</a>
            </div>
        </div>
        `;
        user_profile_mobile =`
        <div class="btn-group">
            <img src="assets/images/default.jpg" data-src="${prof_pic}" class="rounded-circle lazyload" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="dropdown-menu dropdown-menu-left">
                <a class="dropdown-item" href="profile.html"><i class="fas fa-user text-muted mr-3"></i> Profile</a>
                <a class="dropdown-item" href="admin.dashboard.html"><i class="fas fa-tools text-muted mr-3"></i> Admin</a>
                <div class="dropdown-divider"></div>
                <a class="oauth-logout dropdown-item" href="#"><i class="fas fa-sign-out-alt text-muted mr-3"></i> Logout</a>
                </div>
        </div>
        `;
    } else {
        user_profile = `
        <div class="btn-group">
            <img src="assets/images/default.jpg" data-src="${prof_pic}" class="rounded-circle lazyload" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="profile.html"><i class="fas fa-user text-muted mr-3"></i> Profile</a>
                <div class="dropdown-divider"></div>
                <a class="oauth-logout dropdown-item" href="#"><i class="fas fa-sign-out-alt text-muted mr-3"></i> Logout</a>
            </div>
        </div>
        `;
        user_profile_mobile =`
        <div class="btn-group">
            <img src="assets/images/default.jpg" data-src="${prof_pic}" class="rounded-circle lazyload" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="dropdown-menu dropdown-menu-left">
                <a class="dropdown-item" href="profile.html"><i class="fas fa-user text-muted mr-3"></i> Profile</a>
                <div class="dropdown-divider"></div>
                <a class="oauth-logout dropdown-item" href="#"><i class="fas fa-sign-out-alt text-muted mr-3"></i> Logout</a>
                </div>
        </div>
        `;
    }

    oauth_container.html(user_profile);
    oauth_container_mobile.html(user_profile_mobile);
    $("img.lazyload").lazyload();
}

function buildLogin(){
    const oauth_container = $('#oauth-login-container');
    const oauth_container_mobile = $('#oauth-login-container-mobile');
    const login_button = `
    <button class="btn btn-light pr-4 pl-4 mb-2" onClick="window.location='https://discord.com/api/oauth2/authorize?client_id=912087736037568523&redirect_uri=https%3A%2F%2Fblockchainsamurai.io%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify'" type="button">
        Login
    </button>`;
    const login_button_mobile = `
    <button onClick="window.location='https://discord.com/api/oauth2/authorize?client_id=912087736037568523&redirect_uri=https%3A%2F%2Fblockchainsamurai.io%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify'" type="button" class="btn btn-outline-light pr-3 pl-3 mt-2">
        Login
    </button>`;

    oauth_container.html(login_button);
    oauth_container_mobile.html(login_button_mobile);
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