let header00 = $('#header00');
let header0 = $('#header0');
let header1 = $('#header1');
let header2 = $('#header2');
let header3 = $('#header3');
let header4 = $('#header4');
let header5 = $('#header5');
let header6a = $('#header6a');
let header6b = $('#header6b');
let header7 = $('#header7');
let header = $('header');

window.addEventListener('scroll', function(){
    let value = this.window.scrollY;
    //stars.css("left", value * 0.25 + 'px');
    //moon.css('top', value * 1.05 + 'px');
    header7.css('top', value * 0.5 + 'px');
    header6b.css('left', '-'+value * 0.4 + 'px');
    header6b.css('top', value * 0.4 + 'px');
    header6a.css('left', value * 0.4 + 'px');
    header6a.css('top', value * 0.4 + 'px');
    header5.css('top', value * 0.4 + 'px');
    header4.css('left', value * 0.4 + 'px');
    header4.css('top', value * 0.4 + 'px');
    header3.css('top', value * 0.3 + 'px');
    header2.css('top', value * 0.2 + 'px');
    header1.css('left', '-'+value * 0.1 + 'px');
    header1.css('top', value * 0.1 + 'px');
    header0.css('top', value * 0.1 + 'px');
    header00.css('top', value * 0 + 'px');
    header.css('top', value * 0.5 +'px');
});


// MailerLite Universal
(function(m,a,i,l,e,r){ m['MailerLiteObject']=e;function f(){
    var c={ a:arguments,q:[]};
    var r=this.push(c);
    return "number"!=typeof r?r:f.bind(c.q);
}
f.q=f.q||[];m[e]=m[e]||f.bind(f.q);m[e].q=m[e].q||f.q;r=a.createElement(i);
var _=a.getElementsByTagName(i)[0];r.async=1;r.src=l+'?v'+(~~(new Date().getTime()/1000000));
_.parentNode.insertBefore(r,_);})(window, document, 'script', 'https://static.mailerlite.com/js/universal.js', 'ml');
var ml_account = ml('accounts', '3482291', 'x3b2z8g7r2', 'load');

// -------------------------------------------------
// ------------  IMAGE PRELOADER  ------------------
// -------------------------------------------------

$(document).ready(async function() {
    //create image to preload:
    $(".lazyload").lazyload();
});

// -------------------------------------------------
// ---------------  BLOG FEED  ---------------------
// -------------------------------------------------

$(".owl-carousel").owlCarousel({
    loop: true,
    margin: 30,
    autoplay: true,
    smartSpeed: 500,
    responsiveClass: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        700: {
            items: 2,
        },
        1000: {
            items: 3,
        },
    },
});


$(function() {
	getRssFeed("https://blockchainsamurai.io/blog/rss/", mapFeed);
});

function getRssFeed(url, callback) {
    return feednami.load(encodeURI(url), callback);
}
    
function mapFeed(result) {
	if (result.error) {
        console.log(result.error)
    } else {
        buildList(result.feed.entries);
    }
}

function buildList(items) {
    let counter = 0;
    const container = $('#blog-post-container');
    items.forEach(post => {
        if(counter < 5){
            let image = post["media:content"]['@']['url'];
            let title = slicer(post["title"], 30);
            let description = slicer(post["rss:description"]['#'].replace(/<\/?[^>]+(>|$)/g, ""), 100);
            let date = moment(post['pubDate']).format('MMM DD, YYYY');
            let link = post["link"];
            let appendHtml = `
            <!--Blogs Item-->
            <div class="blog-item">
                <div class="blog-img">
                    <a href="${link}">
                        <img src="${image}" alt="">
                    </a>
                </div>
                <div class="blog-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="blog-meta">
                        <span class="more">
                            <a href="${link}" class="link-text">Read More</a>
                        </span>
                        <span class="date">
                            ${date}
                        </span>
                    </div>
                </div>
            </div>
            `;
            container.trigger('add.owl.carousel',[appendHtml]).trigger('refresh.owl.carousel');
        } else {
            return;
        }

        counter = counter+1;
    });
}

function slicer(str, limit){
    if(str.length > limit){
        return str.slice(0,limit)+'...';
    } else {
        return str;
    }
}