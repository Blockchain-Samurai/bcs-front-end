$(document).ready(async function() {
    await getUser().then(async res => {
        console.log(res);
        if(res.role != 2){
            window.location.replace("https://blockchainsamurai.io");
        } else {
            await getAllSamurai().then(res => {
                buildSamurai(res);
            })
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

function buildSamurai(data){
    const samuraiTable = $('#samurai_table');

    samuraiTable.DataTable( {
        dom: "Bfrtip",
        paging: true,
        pageLength: 2,
        ajax: function ( data, callback, settings ) {

            $.ajax({
                //url: "http://127.0.0.1:5501/front-end/temp_data/api-samurai-all.json",
                url: `https://blockchainsamurai.io/api/samurai?page=${page}`,
                method: "GET",
                success: function( data, textStatus, jQxhr ){
                    callback({
                        data: data.data,
                        recordsTotal:  data.samurai_data_total['total'],
                        recordsFiltered:  data.samurai_data_total['total'],
                    });
                },
                error: function( jqXhr, textStatus, errorThrown ){
                }
            });
        },
        serverSide: true,
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "description" },
            { "data": "rarity" },
            { "data": "clan.name" },
            { "data": "user.tag" }
        ]
    } );
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