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