$(document).ready(async function() {
    await getUser().then(async res => {
        console.log(res);
        if(res.role != 2){
            window.location.replace("https://blockchainsamurai.io");
        } else {
            buildSamurai();
        }
    })
    .catch(err => {
        console.log(err);
        //window.location.replace("https://blockchainsamurai.io");
    });
});

// -------------------------------------------------
// ------------  BUILDER FUNCTIONS  ----------------
// -------------------------------------------------

async function buildSamurai(){
    const samuraiTable = $('#samurai-table');
    const samuraiTableBody = $('#samurai-table-body');
    await getAllSamurai(0).then(async res => {
        console.log('get init: ', res);
        let samuraiTotal = parseInt(res.samurai_data_total.total);
        let samuraiPages = Math.ceil(samuraiTotal/25) - 1;
        console.log('total: ', samuraiTotal);
        console.log('pages: ', samuraiPages);

        for(let i = 0; i < samuraiPages; i++){
            await getAllSamurai(i).then(async res => {
                console.log("Get Samurai Page: ", i);
                res.data.forEach(s => {
                    console.log("Current Samurai: ", s);
                    let currRow = `
                    <tr>
                        <td class="text-truncate" style="max-width: 150px;">${s.id}</td>
                        <td class="text-center"><img src="${s.image}" class="img-rounded" alt="Cinque Terre"></td>
                        <td class="text-center">${s.name}</td>
                        <td class="text-center">${s.description}</td>
                        <td class="text-center">${s.rarity}</td>
                        <td class="text-center">${s.clan.name}</td>
                        <td class="text-center">${s.user.tag}</td>
                        <td>
                            <button id="samurai-delete-button-${s.id}" class="btn btn-danger btn-icon-split btn-sm" type="button" data-toggle="modal" data-target="#samurai_modal_${s.id}" data-backdrop="static" data-keyboard="false">
                                <span class="icon text-white-50">
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                                <span class="text">Delete</span>
                            </button>
                        </td>
                    </tr>
                    `;
                    samuraiTableBody.append(currRow);
                });
            });
            console.log("Build data table...")
            samuraiTable.DataTable({
                "columnDefs": [{
                    "targets": 7,
                    "orderable": false
                },
                {
                    "targets": 1,
                    "orderable": false
                }],
            });
        }
    });
}

// -------------------------------------------------
// -------------  AJAX FUNCTIONS  ------------------
// -------------------------------------------------

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

async function getAllSamurai(page){
    return new Promise(function(res,rej){
        jQuery.ajax({
            //url: "http://127.0.0.1:5501/front-end/temp_data/api-samurai-all.json",
            url: `https://blockchainsamurai.io/api/samurai?page=${page}`,
            method: "GET"
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
}