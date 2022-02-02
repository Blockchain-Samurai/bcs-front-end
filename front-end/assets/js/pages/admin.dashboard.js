$(document).ready(async function() {
    await getUser().then(async res => {
        //console.log(res);
        if(res.role != 2){
            window.location.replace("https://blockchainsamurai.io");
        } else {
            buildSamurai();
            buildUsers();
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
        let samuraiTotal = parseInt(res.samurai_data_total.total);
        let samuraiPages = Math.ceil(samuraiTotal/25) - 1;

        for(let i = 0; i <= samuraiPages; i++){
            await getAllSamurai(i).then(async res => {
                res.data.forEach(s => {
                    let currRow = `
                    <tr>
                        <td class="text-center">${s.id}</td>
                        <td class="text-center"><img src="${s.image}" class="rounded-circle" style="max-height: 45px; max-width: 45px;"></td>
                        <td class="text-center">${s.name}</td>
                        <td class="text-truncate" style="max-width:150px;">${s.description}</td>
                        <td class="text-center">${s.rarity}</td>
                        <td class="text-center">${s.clan.name}</td>
                        <td class="text-center">${s.user.tag}</td>
                        <td class="text-center">
                            <button id="samurai-delete-button-${s.id}" class="btn btn-danger btn-sm" type="button" data-toggle="modal" data-target="#samurai_delete_modal_${s.id}" data-backdrop="static" data-keyboard="false">
                                <span class="icon text-white-50">
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                            </button>
                            <button id="samurai-edit-button-${s.id}" class="btn btn-info btn-sm" type="button" data-toggle="modal" data-target="#samurai_edit_modal_${s.id}">
                                <span class="icon text-white-50">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                    `;
                    samuraiTableBody.append(currRow);
                });
            });
            samuraiTable.DataTable({
                "columnDefs": [
                {
                    "targets": 1,
                    "orderable": false
                },
                {
                    "targets": 7,
                    "orderable": false
                }
                ],
                "scrollX": true
            });
        }
    });
}

async function buildUsers(){
    const userTable = $('#user-table');
    const userTableBody = $('#user-table-body');
    const userEditModal = $('#user-edit-modals');
    await getAllUsers(0).then(async res => {
        let userTotal = parseInt(res.user_data_total.total);
        let userPages = Math.ceil(userTotal/25) - 1;
        if ( $.fn.DataTable.isDataTable('#user-table') ) {
            userTable.DataTable().destroy();
            userTableBody.html('');
        }

        for(let i = 0; i <= userPages; i++){
            await getAllUsers(i).then(async res => {
                res.data.forEach(u => {
                    let prof_pic = u.avatar;
                    let options = {year: 'numeric', month: 'short', day: 'numeric'};
                    let formatted_joinedAt = new Date(Date.parse(u.joinedAt)).toLocaleDateString("en-US", options);
                    let prof_pic_val = (/[^/]*$/.exec(prof_pic)[0]).replace(/\.[^/.]+$/, "");
                    if(prof_pic_val == 'null') {
                        prof_pic = "https://blockchainsamurai.io/api/uploads/default.jpg";
                    }
                    let user_role = '<span class="badge badge-pill badge-secondary">User</span>';
                    if(u.role == 2){
                        user_role = '<span class="badge badge-pill badge-danger">Admin</span>';
                    } else if(u.role == 1) {
                        user_role = '<span class="badge badge-pill badge-warning">Mod</span>';
                    }

                    let currModal = `
                    <div class="modal fade" id="user_edit_modal_${u.id}" tabindex="-1" role="dialog" aria-labelledby="userEditModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="userEditLabel">Edit User</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>Select the user's new role below. The users current role is: ${user_role}</p>
                                    <div class="form-group">
                                        <label for="user-role">User Role</label>
                                        <select class="form-control" id="user-role-${u.id}">
                                            <option value="0">User</option>
                                            <option value="1">Mod</option>
                                            <option value="2">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" id='save-button-user-${u.id}' onclick="saveUserChange(${u.id})">Save</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    let currRow = `
                    <tr>
                        <td class="text-center">${u.id}</td>
                        <td class="text-center"><img src="${prof_pic}" class="rounded-circle" style="max-height: 45px; max-width: 45px;"></td>
                        <td class="text-center">${u.tag}</td>
                        <td class="text-center">${user_role}</td>
                        <td class="text-center">${formatted_joinedAt}</td>
                        <td>
                            <button id="user-edit-button-${u.id}" class="btn btn-info btn-sm" type="button" data-toggle="modal" data-target="#user_edit_modal_${u.id}">
                                <span class="icon text-white-50">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                    `;
                    userTableBody.append(currRow);
                    userEditModal.append(currModal);
                });
            });
            userTable.DataTable({
                "columnDefs": [{
                    "targets": 7,
                    "orderable": false
                },
                {
                    "targets": 1,
                    "orderable": false
                }],
                "scrollX": true
            });
        }
    });
}

// -------------------------------------------------
// -------------  HELPER FUNCTIONS  ----------------
// -------------------------------------------------

async function saveUserChange(user_id){
    let saveBtn = $(`#save-button-user-${user_id}`);
    let currModal = $(`#user_edit_modal_${user_id}`);
    let newRole = parseInt($(`#user-role-${user_id} :selected`).val());
    let newBody = { role: newRole };
    let user_role = '<span class="badge badge-pill badge-secondary">User</span>';

    saveBtn.html('<i class="fas fa-spinner fa-pulse""></i>');
    saveBtn.attr('disabled', true);
    if(newRole == 2){
        user_role = '<span class="badge badge-pill badge-danger">Admin</span>';
    } else if(newRole == 1) {
        user_role = '<span class="badge badge-pill badge-warning">Mod</span>';
    }

    await updateUser(user_id, newBody).then( res => {
        jQuery.notify(
            {title: 'BING BONG - Success', message: `User id ${user_id} successfully updated role to ${user_role}`, icon:'fas fa-check-circle'},
              {
                type: 'success',
                delay: 5000,
            }
        );
        saveBtn.attr('disabled', false);
        currModal.modal('hide');
    }).catch(err => {
        jQuery.notify(
            {title: 'UH OH - Big Bad Error :(', message: `Failed to update user id ${user_id} to the ${user_role} role`, icon:'fas fa-exclamation-circle'},
              {
                type: 'danger',
                delay: 5000,
            }
        );
        console.log(err);
        saveBtn.html('Retry');
        saveBtn.attr('disabled', false);
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

async function getAllUsers(page){
    return new Promise(function(res,rej){
        jQuery.ajax({
            //url: "http://127.0.0.1:5501/front-end/temp_data/api-user-profile.json",
            url: `https://blockchainsamurai.io/api/user?page=${page}`,
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

async function updateUser(user_id,data){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: `https://blockchainsamurai.io/api/user/${user_id}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(data),
        }).then(response => {
            res(response);
            buildUsers();
        }).catch(error => {
            rej(error);
        })
    });
}