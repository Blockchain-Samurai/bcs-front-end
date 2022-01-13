let base_map = $("#hachi-sho-base")[0];
let base_regions = $('#hachi-sho-regions')[0];
let base_container = $('#map_header');

let region1 = $("#region1");
let region2 = $("#region2");
let region3 = $("#region3");
let region4 = $("#region4");
let region5 = $("#region5");
let region6 = $("#region6");
let region7 = $("#region7");
let region8 = $("#region8");

let region1_container = $('#r1');
let region2_container = $('#r2');
let region3_container = $('#r3');
let region4_container = $('#r4');
let region5_container = $('#r5');
let region6_container = $('#r6');
let region7_container = $('#r7');
let region8_container = $('#r8');


// -------------------------------------------------
// -------------  IMAGE PRELOADER  -----------------
// -------------------------------------------------

const clan_cont = $('#clan-card-container');

$(document).ready(async function() {
    //create image to preload:
    $(".lazyload").lazyload();

    await getClans().then(res => {
        clan_cont.html('');
        res.forEach(clan => {
            let clan_card_temp = `
            <div class="col-xl-4 col-md-6 col-sm-12 mb-5">
                <div id="clan-${clan.id}" data-tilt class="clan-card">
                    <div class="clan-card-img">
                        <img class="lazyload img-fluid rounded" src='assets/images/clans/loading.gif' data-src='${clan.image}'>
                    </div>
                    <div class="clan-card-content text-center">
                        <h4>${clan.name}</h4>
                    </div>
                </div>
            </div>
            `;
            clan_cont.append(clan_card_temp);
        });
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
        $("img.lazyload").lazyload();
    })
    .catch(err => {
        console.log("An error occured", err.responseText);
        clan_cont.html(`
            <div class="col p-5 m-5">    
                <p class="text-danger text-center"><i class="fas fa-exclamation-triangle"></i> An error occured</p>
                <p class="text-muted text-center">Please try again later...</p>
            </div>
            `);
    });
});

// -------------------------------------------------
// --------------  AJAX REQUESTS  ------------------
// -------------------------------------------------

async function getClans(){
    return new Promise(function(res,rej){
      jQuery.ajax({
        url: "https://blockchainsamurai.io/temp_data/clan_data.json",
        method: "GET",
        contentType: "application/json; charset=utf-8",
      }).then(response => {
        res(response);
      }).catch(error => {
        rej(error);
      })
    });
  }

// -------------------------------------------------
// ---------------  MAP REGIONS  -------------------
// -------------------------------------------------
let r1 = false;
region1.click(function(){
    region1.toggleClass('enabled');
    region1_container.collapse('toggle');
});

region2.click(function(){
    region2.toggleClass('enabled');
    region2_container.collapse('toggle');
});

region3.click(function(){
    region3.toggleClass('enabled');
    region3_container.collapse('toggle');
});

region4.click(function(){
    region4.toggleClass('enabled');
    region4_container.collapse('toggle');
});

region5.click(function(){
    region5.toggleClass('enabled');
    region5_container.collapse('toggle');
});

region6.click(function(){
    region6.toggleClass('enabled');
    region6_container.collapse('toggle');
});

region7.click(function(){
    region7.toggleClass('enabled');
    region7_container.collapse('toggle');
});

region8.click(function(){
    region8.toggleClass('enabled');
    region8_container.collapse('toggle');
});

// -------------------------------------------------
// -----------  ACCORDIAN REGIONS  -----------------
// -------------------------------------------------

region1_container.on('hidden.bs.collapse', function () {
    region1.removeClass('enabled');
})

region1_container.on('show.bs.collapse', function () {
    region1.addClass('enabled');
})

region2_container.on('hidden.bs.collapse', function () {
    region2.removeClass('enabled');
})

region2_container.on('show.bs.collapse', function () {
    region2.addClass('enabled');
})

region3_container.on('hidden.bs.collapse', function () {
    region3.removeClass('enabled');
})

region3_container.on('show.bs.collapse', function () {
    region3.addClass('enabled');
})

region4_container.on('hidden.bs.collapse', function () {
    region4.removeClass('enabled');
})

region4_container.on('show.bs.collapse', function () {
    region4.addClass('enabled');
})

region5_container.on('hidden.bs.collapse', function () {
    region5.removeClass('enabled');
})

region5_container.on('show.bs.collapse', function () {
    region5.addClass('enabled');
})

region6_container.on('hidden.bs.collapse', function () {
    region6.removeClass('enabled');
})

region6_container.on('show.bs.collapse', function () {
    region6.addClass('enabled');
})

region7_container.on('hidden.bs.collapse', function () {
    region7.removeClass('enabled');
})

region7_container.on('show.bs.collapse', function () {
    region7.addClass('enabled');
})

region8_container.on('hidden.bs.collapse', function () {
    region8.removeClass('enabled');
})

region8_container.on('show.bs.collapse', function () {
    region8.addClass('enabled');
})

// -------------------------------------------------
// -------------  ZOOM CONTROLS  -------------------
// -------------------------------------------------

let zoomIn_btn = $('#zoom-control-in');
let zoomOut_btn = $('#zoom-control-out');
let zoomReset_btn = $('#zoom-control-reset');

let zoom_item = $('.zoom-item');
let initZoom_height = zoom_item[0]["clientHeight"];
let initZoom_width = zoom_item[0]["clientWidth"];

let regionLine_option = $('#region-lines-option');
let roadLine_option = $('#road-lines-option');
let regionLines = $('#hachi-sho-outline');
let roadLines = $('#hachi-sho-roads');

regionLine_option.change(function() {
    if($(this).is(":checked")) {
        regionLines.removeClass('d-none');
        regionLines.addClass('d-block');
    } else {
        regionLines.removeClass('d-block');
        regionLines.addClass('d-none');
    }
});

roadLine_option.change(function() {
    if($(this).is(":checked")) {
        roadLines.removeClass('d-none');
        roadLines.addClass('d-block');
    } else {
        roadLines.removeClass('d-block');
        roadLines.addClass('d-none');
    }
});

zoomIn_btn.click(function(){
    let currZoom_height = zoom_item[0]["clientHeight"];
    let currZoom_width = zoom_item[0]["clientWidth"];

    if (currZoom_height == 2500) return false;
    else {
        zoom_item.each(function(i, obj) {
            obj.style.height = (currZoom_height + 100)+"px";
            obj.style.width = (currZoom_width + 100)+"px";
        });
    }
});

zoomOut_btn.click(function(){
    let currZoom_height = zoom_item[0]["clientHeight"];
    let currZoom_width = zoom_item[0]["clientWidth"];

    if (currZoom_height == initZoom_height) return false;
    else {
        zoom_item.each(function(i, obj) {
            obj.style.height = (currZoom_height - 100)+"px";
            obj.style.width = (currZoom_width - 100)+"px";
        });
    }
});

zoomReset_btn.click(function(){
    zoom_item.each(function(i, obj) {
        obj.style.height = initZoom_height+"px";
        obj.style.width = initZoom_width+"px";
    });
});