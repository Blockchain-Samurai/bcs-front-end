
$(document).ready(async function() {
    //create image to preload:
    $(".lazyload").lazyload();

    await getUser().then(async res => {
        buildProfile(res);

        await getSamurai(res.id, 0).then(async res => {
            buildSamurai(res.data);
            if(res.data.length >= 1){
                await getEvents().then(async res => {
                    buildEvents();
                });
            }
        }).catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
        window.location.replace("https://discord.com/api/oauth2/authorize?client_id=912087736037568523&redirect_uri=https%3A%2F%2Fblockchainsamurai.io%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify");
    });
});

function buildProfile(user){
    let userpic_container = $('#user_pic_container');
    let username_container = $('#user_name_container');
    username_container.html(user.tag);
    userpic_container.html(`<img src="assets/images/default.jpg" class="img-fluid samurai_profile_img rounded-circle lazyload" data-src='${user.avatar}' alt="thumb" />`);
    $(".lazyload").lazyload();
}

function buildSamurai(samurai){
    const samurai_container = $('#samurai-container');
    const event_container = $('#event-container');
    const samurai_modal_container = $('#samurai_modal_container');

    if(samurai.length == 25){
        samurai_container.html('');
        samurai.forEach(s => {
            console.log(s);
            let formatted_clan;
            if(s.clan.name == 'Ronin'){
                formatted_clan='None';
            } else {
                formatted_clan = s.clan.name;
            }
            let samurai_card = `
            <div class="col-12 col-sm-6 col-lg-4 mb-3" type="button" data-toggle="modal" data-target="#samurai_modal_${s.id}">
                <div class="card" data-tilt>
                    <img class="card-img-top lazyload" src='assets/images/clans/loading.gif' data-src='${s.image}'>
                </div>
            </div>
            `;
            let samurai_modal=`
            <div class="modal fade" data-tilt id="samurai_modal_${s.id}" tabindex="-1" role="dialog" aria-labelledby="samuraiModalLabel_${s.id}" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="samuraiModalLabel_${s.id}">${s.name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img class="img-fluid rounded mb-3" src='assets/images/1.png'>
                            <h5>Rarity: ${s.rarity}</h5>
                            <h5>Clan: ${formatted_clan}</h5>
                            <h5>Role: ${s.role}</h5>
                            <hr>
                            <p>${s.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;

            samurai_container.append(samurai_card);
            samurai_modal_container.append(samurai_modal);
        });
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
        $("img.lazyload").lazyload();
    } else if(samurai.length >= 1) {
        samurai_container.html('');
        samurai.forEach(s => {
            console.log(s);
            let formatted_clan;
            if(s.clan.name == 'Ronin'){
                formatted_clan='None';
            } else {
                formatted_clan = s.clan.name;
            }
            let samurai_card = `
            <div class="col-12 col-sm-6 col-lg-4 mb-3" type="button" data-toggle="modal" data-target="#samurai_modal_${s.id}">
                <div class="card" data-tilt>
                    <img class="card-img-top lazyload" src='assets/images/clans/loading.gif' data-src='${s.image}'>
                </div>
            </div>
            `;
            let samurai_modal=`
            <div class="modal fade" data-tilt id="samurai_modal_${s.id}" tabindex="-1" role="dialog" aria-labelledby="samuraiModalLabel_${s.id}" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="samuraiModalLabel_${s.id}">${s.name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img class="img-fluid rounded mb-3" src='assets/images/1.png'>
                            <h5>Rarity: ${s.rarity}</h5>
                            <h5>Clan: ${formatted_clan}</h5>
                            <h5>Role: ${s.role}</h5>
                            <hr>
                            <p>${s.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;

            samurai_container.append(samurai_card);
            samurai_modal_container.append(samurai_modal);
        });
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
        $("img.lazyload").lazyload();
    } else {
        samurai_container.html(`
        <div class="col p-5 m-5">    
            <p class="text-muted text-center">Hmm... It doesn't look like you have any Samurai yet.</p>
        </div>
        `);
        event_container.html(`
        <div class="col p-5 m-5">    
            <p class="text-muted text-center">Hmm... It doesn't look like you have any Samurai yet to vote with.</p>
        </div>
        `);
    }
}

function buildEvents(events){
    // TODO : finish event endpoints
    console.log('Build events!');
}

async function getUser(){
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

async function getSamurai(user_id, page){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: `https://blockchainsamurai.io/api/samurai/user/${user_id}?page=${page}`,
            method: "GET"
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
}

async function getEvents(){
    // TODO : finish event endpoints
    return 1;
}