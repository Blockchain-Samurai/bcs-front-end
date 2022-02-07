$(document).ready(async function() {
    await getUser().then(async res => {
        //console.log(res);
        if(res.role != 2){
            window.location.replace("https://blockchainsamurai.io");
        } else {
            buildSamurai().then(res => { 
                buildUsers();
                buildClans();
            });
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
    const samuraiEditModals = $('#samurai-edit-modals');
    const samuraiDeleteModals = $('#samurai-delete-modals');
    await getAllSamurai(0).then(async res => {
        let samuraiTotal = parseInt(res.samurai_data_total.total);
        let samuraiPages = Math.ceil(samuraiTotal/25) - 1;

        for(let i = 0; i <= samuraiPages; i++){
            await getAllSamurai(i).then(async res => {
                res.data.forEach(s => {
                    let jpName = '--';
                    let formatted_role;
                    if(s.japaneseName != null){
                        jpName = s.japaneseName;
                    }
                    if(s.role == 0){
                        formatted_role = '<span class="badge badge-pill badge-danger">Ronin</span>';
                    } else if (s.role == 1){
                        formatted_role = '<span class="badge badge-pill badge-primary">Samurai</span>';
                    } else if (s.role == 2){
                        formatted_role = '<span class="badge badge-pill badge-info">Daimyo</span>';
                    } else if (s.role == 3){
                        formatted_role = '<span class="badge badge-pill badge-success">Shogun</span>';
                    } else if (s.role == 4){
                        formatted_role = '<span class="badge badge-pill badge-secondary">Guard</span>';
                    } else if (s.role == 5){
                        formatted_role = '<span class="badge badge-pill badge-warning">Emperor</span>';
                    }
                    let currRow = `
                    <tr>
                        <td class="text-center">${s.id}</td>
                        <td class="text-center"><img src="${s.image}" class="rounded-circle" style="max-height: 45px; max-width: 45px;"></td>
                        <td class="text-center">${s.name}</td>
                        <td class="text-center">${jpName}</td>
                        <td class="text-truncate" style="max-width:150px;">${s.description}</td>
                        <td class="text-center">${formatted_role}</td>
                        <td class="text-center">${s.rarity}</td>
                        <td class="text-center">${s.clan.name}</td>
                        <td class="text-center">${s.user.tag}</td>
                        <td class="text-center">
                            <button id="samurai-edit-button-${s.id}" class="btn btn-info btn-sm" type="button" data-toggle="modal" data-target="#samurai_edit_modal_${s.id}" data-backdrop="static" data-keyboard="false">
                                <span class="icon text-white-50">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                            <button id="samurai-delete-button-${s.id}" class="btn btn-danger btn-sm" type="button" data-toggle="modal" data-target="#samurai_delete_modal_${s.id}" data-backdrop="static" data-keyboard="false">
                                <span class="icon text-white-50">
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                    `;
                    let roleArray=[null,null,null,null,null,null];
                    roleArray[s.role] = "selected";

                    let currEditModal = `
                    <div class="modal fade" id="samurai_edit_modal_${s.id}" tabindex="-1" role="dialog" aria-labelledby="samuraiEditModalLabel-${s.id}" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="samuraiEditLabel-${s.id}">Edit Samurai | ${s.name}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <div class="custom-control custom-switch mb-3">
                                                <input type="checkbox" class="custom-control-input" id="samurai-edit-toggle-update-image-${s.id}">
                                                <label class="custom-control-label" for="samurai-edit-toggle-update-image-${s.id}">Update Samurai Image</label>
                                                <small id="samurai-edit-toggle-update-image-help-${s.id}" class="form-text text-muted">
                                                    Samurai image is optional, enable this option to upload a new image.
                                                </small>
                                            </div>
                                        </div>
                                        <div id="samurai-edit-image-upload-${s.id}" class="form-group d-none">
                                        <input type="file" class="form-control-file" accept="image/png, image/jpeg, image/gif">
                                        </div>
                                        <hr>
                                        <div class="form-group">
                                            <label for="samurai-edit-name-${s.id}">Name</label>
                                            <input type="email" class="form-control" id="samurai-edit-name-${s.id}" placeholder="Enter samurai name..." value="${s.name}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="samurai-edit-japanese-name-${s.id}">Japanese Name</label>
                                            <input type="email" class="form-control" id="samurai-edit-japanese-name-${s.id}" placeholder="Enter samurai's japanese name..." value="${jpName}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="samurai-edit-description-${s.id}">Description</label>
                                            <textarea class="form-control" id="samurai-edit-description-${s.id}" rows="3">${s.description}</textarea>
                                            <small id="samurai-edit-description-help-${s.id}" class="form-text text-muted">
                                                Description is an optional field and should only be used on rare samurai.
                                            </small>
                                        </div>
                                        <div class="form-group">
                                            <label for="samurai-edit-role-${s.id}">Role</label>
                                            <select class="form-control" id="samurai-edit-role">
                                                <option value="0" ${roleArray[0]}>Ronin</option>
                                                <option value="1" ${roleArray[1]}>Samurai</option>
                                                <option value="2" ${roleArray[2]}>Daimyo</option>
                                                <option value="3" ${roleArray[3]}>Shogun</option>
                                                <option value="4" ${roleArray[4]}>Guard</option>
                                                <option value="5" ${roleArray[5]}>Emperor</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="samurai-edit-clan-${s.id}">Clan</label>
                                            <select class="form-control" id="samurai-edit-clan-${s.id}" class="clan-selector">
                                            <option value="curr" selected>Current Clan</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="samurai-edit-owner-${s.id}">Owner</label>
                                            <select class="form-control owner-selector" id="samurai-edit-owner-${s.id}">
                                                <option value="curr" selected>Current Owner</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="samurai-edit-rarity-${s.id}">Rarity</label>
                                            <input type="number" class="form-control" id="samurai-edit-rarity-${s.id}" aria-describedby="samurai-edit-rarity-help" value="${s.rarity}">
                                            <small id="samurai-edit-rarity-help-${s.id}" class="form-text text-muted">Rarity is a numeric value between 1 - 10</small>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" id='save-button-samurai-${s.id}' onclick="">Save</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                        <script>
                            $('#samurai-edit-toggle-update-image-${s.id}').change(function() {
                                if($(this).is(":checked")) {
                                    $('#samurai-edit-image-upload-${s.id}').removeClass('d-none');
                                    $('#samurai-edit-image-upload-${s.id}').addClass('d-block');
                                } else {
                                    $('#samurai-edit-image-upload-${s.id}').removeClass('d-block');
                                    $('#samurai-edit-image-upload-${s.id}').addClass('d-none');
                                }
                            });
                        </script>
                    </div>
                    `;
                    let currDeleteModal = `
                    <div class="modal fade" id="samurai_delete_modal_${s.id}" tabindex="-1" role="dialog" aria-labelledby="samuraiDeleteLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="samuraiDeleteLabel">Delete Samurai</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>Are you sure you would like to delete the following Samurai:</p>
                                    <div class="row container">
                                        <p class="col-12 text-truncate bg-dark text-white">${s.name}</p>
                                    </div>
                                    <p>Please know that this action is irreversible.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" id='delete-button-samurai-${s.id}' onclick="deleteSamurai(${s.id})">Delete</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    samuraiTableBody.append(currRow);
                    samuraiEditModals.append(currEditModal);
                    samuraiDeleteModals.append(currDeleteModal);
                });
            });
            samuraiTable.DataTable({
                "columnDefs": [
                    {
                        "targets": 1,
                        "orderable": false
                    },
                    {
                        "targets": 9,
                        "orderable": false
                    }
                ],
                "sScrollX": "100%",
                "sScrollXInner": "110%"
            });
        }
    });
}

async function buildUsers(){
    const userTable = $('#user-table');
    const userTableBody = $('#user-table-body');
    const userEditModal = $('#user-edit-modals');
    let totalUsersMetric = [];
    await getAllUsers(0).then(async res => {
        let userTotal = parseInt(res.user_data_total.total);
        let userPages = Math.ceil(userTotal/25) - 1;

        for(let i = 0; i <= userPages; i++){
            await getAllUsers(i).then(async res => {
                res.data.forEach(u => {
                    let prof_pic = u.avatar;
                    let options_joinedAt = {year: 'numeric', month: 'short', day: 'numeric'};
                    let options_chart = {year: 'numeric', month: 'short'};
                    let formatted_joinedAt = new Date(Date.parse(u.joinedAt)).toLocaleDateString("en-US", options_joinedAt);
                    let formatted_chart = new Date(Date.parse(u.joinedAt)).toLocaleDateString("en-US", options_chart);
                    let formatted_lastlogin = '--';
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
                    if(u.lastLogin != null){
                        let options_lastlogin = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
                        formatted_lastlogin = new Date(Date.parse(u.lastLogin)).toLocaleDateString("en-US", options_lastlogin);
                    }
                    
                    let checkMonth = totalUsersMetric.map(obj => obj.x).indexOf(formatted_chart);
                    if(checkMonth != -1) {
                        totalUsersMetric[checkMonth].y = totalUsersMetric[checkMonth].y + 1;
                    } else {
                        totalUsersMetric.push({x: formatted_chart, y:1});
                    }

                    let currModal = `
                    <div class="modal fade" id="user_edit_modal_${u.id}" tabindex="-1" role="dialog" aria-labelledby="userEditModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="userEditLabel">Edit User | ${u.tag}</h5>
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
                        <td class="text-center">${formatted_lastlogin}</td>
                        <td class="text-center">
                            <button id="user-edit-button-${u.id}" class="btn btn-info btn-sm" type="button" data-toggle="modal" data-target="#user_edit_modal_${u.id}">
                                <span class="icon text-white-50">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                    `;

                    let ownerOptions = `
                        <option value="${u.id}">${u.tag}</option>
                    `;

                    $('.owner-selector').append(ownerOptions);
                    userTableBody.append(currRow);
                    userEditModal.append(currModal);
                });
            });
            userTable.DataTable({
                "columnDefs": [
                    {
                        "targets": 6,
                        "orderable": false
                    },
                    {
                        "targets": 1,
                        "orderable": false
                    }
                ],
                "sScrollX": "100%",
                "sScrollXInner": "110%"
            });
            
            const data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [{
                    label: 'Users Joined',
                    backgroundColor: 'rgb(66, 135, 245)',
                    borderColor: 'rgb(66, 135, 245)',
                    data: totalUsersMetric,
                }]
            };
            
            const config = {
                type: 'bar',
                data: data,
                options: {
                    scales: {
                        y: {
                          beginAtZero: true
                        },
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month',
                                tooltipFormat:'MMM YYYY'
                            },
                            displayFormats: {
                                month: 'MMM YYYY'
                            },
                            min: new Date('2022-01-01 00:00:00'),
                        }
                    },
                    plugins: { legend: { display: false }}
                }
            };

            new Chart(
                document.getElementById('users_joined'),
                config
            );
        }
    });
}

async function buildClans(){
    const clanTable = $('#clan-table');
    const clanTableBody = $('#clan-table-body');
    const clanEditModals = $('#clan-edit-modals');
    const clanDeleteModals = $('#clan-delete-modals');
    await getClans(0).then(async res => {
        let clanTotal = parseInt(res.clan_data_total.total);
        let clanPages = Math.ceil(clanTotal/25) - 1;

        for(let i = 0; i <= clanPages; i++){
            await getClans(i).then(async res => {
                res.data.forEach(c => {
                    let currRow = `
                    <tr>
                        <td class="text-center">${c.id}</td>
                        <td class="text-center"><img src="${c.image}" class="rounded-circle" style="max-height: 45px; max-width: 45px;"></td>
                        <td class="text-center">${c.name}</td>
                        <td class="text-truncate" style="max-width:150px;">${c.description}</td>
                        <td class="text-center">
                            <button id="clan-edit-button-${c.id}" class="btn btn-info btn-sm" type="button" data-toggle="modal" data-target="#clan_edit_modal_${c.id}" data-backdrop="static" data-keyboard="false">
                                <span class="icon text-white-50">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                            <button id="clan-delete-button-${c.id}" class="btn btn-danger btn-sm" type="button" data-toggle="modal" data-target="#clan_delete_modal_${c.id}" data-backdrop="static" data-keyboard="false">
                                <span class="icon text-white-50">
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                    `;

                    let currEditModal = `
                    <div class="modal fade" id="clan_edit_modal_${c.id}" tabindex="-1" role="dialog" aria-labelledby="clanEditModalLabel-${c.id}" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="clanEditLabel-${c.id}">Edit Clan | ${c.name}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <div class="custom-control custom-switch mb-3">
                                                <input type="checkbox" class="custom-control-input" id="clan-edit-toggle-update-image-${c.id}">
                                                <label class="custom-control-label" for="clan-edit-toggle-update-image-${c.id}">Update Clan Image</label>
                                                <small id="clan-edit-toggle-update-image-help-${c.id}" class="form-text text-muted">
                                                    Clan image is optional, enable this option to upload a new image.
                                                </small>
                                            </div>
                                        </div>
                                        <div id="clan-edit-image-upload-${c.id}" class="form-group d-none">
                                        <input type="file" class="form-control-file" accept="image/png, image/jpeg, image/gif">
                                        </div>
                                        <hr>
                                        <div class="form-group">
                                            <label for="clan-edit-name-${c.id}">Name</label>
                                            <input type="email" class="form-control" id="clan-edit-name-${c.id}" placeholder="Enter clan name..." value="${c.name}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="clan-edit-description-${c.id}">Description</label>
                                            <textarea class="form-control" id="clan-edit-description-${c.id}" rows="3">${c.description}</textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" id='save-button-clan-${c.id}' onclick="">Save</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                        <script>
                            $('#clan-edit-toggle-update-image-${c.id}').change(function() {
                                if($(this).is(":checked")) {
                                    $('#clan-edit-image-upload-${c.id}').removeClass('d-none');
                                    $('#clan-edit-image-upload-${c.id}').addClass('d-block');
                                } else {
                                    $('#clan-edit-image-upload-${c.id}').removeClass('d-block');
                                    $('#clan-edit-image-upload-${c.id}').addClass('d-none');
                                }
                            });
                        </script>
                    </div>
                    `;

                    let currDeleteModal = `
                    <div class="modal fade" id="clan_delete_modal_${c.id}" tabindex="-1" role="dialog" aria-labelledby="clanDeleteLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="clanDeleteLabel">Delete Clan</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>Are you sure you would like to delete the following clan:</p>
                                    <div class="row container">
                                        <p class="col-12 text-truncate bg-dark text-white">${c.name}</p>
                                    </div>
                                    <p>Please know that this action is irreversible.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" id='delete-button-clan-${c.id}' onclick="deleteClan(${c.id})">Delete</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    clanTableBody.append(currRow);
                    clanEditModals.append(currEditModal);
                    clanDeleteModals.append(currDeleteModal);
                });
            });
            clanTable.DataTable({
                "columnDefs": [
                    {
                        "targets": 1,
                        "orderable": false
                    },
                    {
                        "targets": 4,
                        "orderable": false
                    }
                ],
                "sScrollX": "100%",
                "sScrollXInner": "110%"
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
            {title: 'Success', message: `User id ${user_id} successfully updated role to ${user_role}. Please refresh page to see updated values`, icon:'fas fa-check-circle'},
              {
                type: 'success',
                delay: 5000,
            }
        );
        saveBtn.attr('disabled', false);
        currModal.modal('hide');
    }).catch(err => {
        jQuery.notify(
            {title: 'Error', message: `Failed to update user id ${user_id} to the ${user_role} role. Check console log for error.`, icon:'fas fa-exclamation-circle'},
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

async function saveClanChange(clan_id){
    let saveBtn = $(`#save-button-clan-${clan_id}`);
    let currModal = $(`#clan_edit_modal_${clan_id}`);

    saveBtn.html('<i class="fas fa-spinner fa-pulse""></i>');
    saveBtn.attr('disabled', true);

    await updateClan(clan_id, newBody).then( res => {
        jQuery.notify(
            {title: 'Success', message: `Clan id ${clan_id} successfully updated. Please refresh page to see updated values`, icon:'fas fa-check-circle'},
              {
                type: 'success',
                delay: 5000,
            }
        );
        saveBtn.attr('disabled', false);
        currModal.modal('hide');
    }).catch(err => {
        jQuery.notify(
            {title: 'Error', message: `Failed to update clan id ${clan_id}. Check console log for error.`, icon:'fas fa-exclamation-circle'},
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
            //url: "http://127.0.0.1:5501/front-end/temp_data/api-users.json",
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

async function getClans(page){
    return new Promise(function(res,rej){
      jQuery.ajax({
        url: `https://blockchainsamurai.io/api/clan?page=${page}`,
        //url: "http://127.0.0.1:5501/front-end/temp_data/clan_data.json",
        method: "GET",
        contentType: "application/json; charset=utf-8",
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
        }).catch(error => {
            rej(error);
        })
    });
}

async function updateSamurai(samurai_id,data){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: `https://blockchainsamurai.io/api/samurai/${samurai_id}`,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(data),
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
    });
}

async function updateClan(clan_id,data){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: `https://blockchainsamurai.io/api/clan/${clan_id}`,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(data),
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
    });
}

async function updateClanImage(clan_id,form){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: `https://blockchainsamurai.io/api/clan/${clan_id}/image`,
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: JSON.stringify(data),
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
    });
}