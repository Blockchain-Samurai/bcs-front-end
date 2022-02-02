$(document).ready(async function() {
    //create image to preload:
    $(".lazyload").lazyload();

    await getUser().then(async res => {
        buildProfile(res);

        await getWallet().then(async res => {
            buildWallets(res);
        });

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
    let prof_pic = user.avatar;
    let prof_pic_val = (/[^/]*$/.exec(prof_pic)[0]).replace(/\.[^/.]+$/, "");
    if(prof_pic_val == 'null') {
        prof_pic = "https://blockchainsamurai.io/api/uploads/default.jpg";
    }
    username_container.html(user.tag);
    userpic_container.html(`<img src="assets/images/default.jpg" class="img-fluid samurai_profile_img rounded-circle lazyload" data-src='${prof_pic}' alt="thumb" />`);
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
            // console.log(s);
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
                            <img class="img-fluid rounded mb-3 lazyload" src='assets/images/clans/loading.gif' data-src='${s.image}'>
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

function buildWallets(wallets){
    const nowalletContainer = $('#no-wallet-container');
    const walletTableContainer = $('#wallet-table-container');
    const walletTable = $('#wallet-table');
    const walletTableBody = $('#wallet-table-body');
    const walletModalContainer = $('#wallet_modal_container');
    if(wallets.length < 1){
        walletTableContainer.hide();
        nowalletContainer.show();
        return;
    } else {
        nowalletContainer.hide();
        walletTableContainer.show();

        wallets.forEach((w) => {
            let validatedIcon;
            if(w.validated){
                validatedIcon = '<i class="fas fa-check-circle text-success"></i>';
            } else {
                validatedIcon = '<i class="fas fa-exclamation-circle text-danger"></i>';
            }

            let tr = `
            <tr>
                <td class="text-truncate" style="max-width: 150px;">${w.address}</td>
                <td class="text-center">${w.provider}</td>
                <td class="text-center">${validatedIcon}</td>
                <td>
                    <button id="wallet-delete-button-${w.id}" class="btn btn-danger btn-icon-split btn-sm" type="button" data-toggle="modal" data-target="#wallet_modal_${w.id}" data-backdrop="static" data-keyboard="false">
                        <span class="icon text-white-50">
                            <i class="fas fa-trash-alt"></i>
                        </span>
                        <span class="text">Delete</span>
                    </button>
                </td>
            </tr>
            `;
            walletTableBody.append(tr);

            let wallet_modal=`
            <div class="modal fade" id="wallet_modal_${w.id}" tabindex="-1" role="dialog" aria-labelledby="walletModalLabel_${w.id}" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="walletModalLabel_${w.id}">Delete Wallet</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you would like to delete wallet address:</p>
                            <div class="row container">
                                <p class="col-12 text-truncate bg-dark text-white">${w.address}</p>
                            </div>
                            <p>Please know that this action is irreversible and may result in Samurai not being associated with your account.</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <button class="btn btn-danger" onclick="deleteWallet('${w.id}')">Delete Wallet</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            walletModalContainer.append(wallet_modal);
        });
        walletTable.DataTable({
            "searching": false,
            "lengthChange": false,
            "bPaginate": false,
            "bLengthChange": false,
            "scrollX": true,
            "columnDefs": [{
                "targets": 3,
                "orderable": false
            }],
        });
    }
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

async function getWallet(){
    return new Promise(function(res,rej){
        jQuery.ajax({
            //url: "http://127.0.0.1:5501/front-end/temp_data/api-user-wallet.json",
            url: 'https://blockchainsamurai.io/api/user/wallet',
            method: "GET"
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
}

async function deleteWallet(wallet_id){
    let walletButton = $(`#wallet-delete-button-${wallet_id}`);
    let walletModal = $(`#wallet_modal_${wallet_id}`);
    walletButton.html('<i class="fas fa-spinner fa-pulse""></i>');
    walletButton.attr('disabled', true);
    jQuery.ajax({
        url: `https://blockchainsamurai.io/api/user/wallet/${wallet_id}`,
        method: "DELETE"
    }).then(async response => {
        walletModal.modal('hide');
        jQuery.notify(
            {title: 'Wallet Deleted', message: `Your Nami Wallet was successfully deleted.`, icon:'fas fa-check-circle'},
              {
                type: 'success',
                delay: 5000,
            }
        );
        await getWallet().then(async res => {
            buildWallets(res);
        });
    }).catch(error => {
        jQuery.notify(
            {title: 'Error Deleting Wallet', message: `We were unable to delete your wallet at this time. Please try again in a little bit.`, icon:'fas fa-exclamation-circle'},
              {
                type: 'danger',
                delay: 10000,
            }
        );
        walletButton.html(`
            <span class="icon text-white-50">
                <i class="fas fa-trash-alt"></i>
            </span>
            <span class="text">Retry</span>
        `);
        walletButton.removeAttr('disabled');
        walletModal.modal('hide');
    })
}