import * as wasm from "https://cdn.jsdelivr.net/npm/@emurgo/cardano-serialization-lib-asmjs@9.1.2/cardano_serialization_lib.min.js";

let nami_button = $('#nami-button')
nami_button.on('click', async function(){
    nami_button.html('<i class="fas fa-spinner fa-pulse""></i>');
    nami_button.attr('disabled', true);

    if(!window.cardano){
        nami_button.html('Retry');
        nami_button.removeAttr('disabled');
        jQuery.notify(
            {title: 'No Wallet Found', message: `We were unable to find a Nami Wallet on your browser. You can install Nami Wallet here: <a href='https://namiwallet.io/'>namiwallet.io</a>`, icon:'fas fa-exclamation-circle'},
              {
                type: 'danger',
                delay: 10000,
            }
        );
        return;
    }

    window.cardano.nami.enable().then(async (nami) => {

        // let utxos = await getUtxos(nami);
        let address = await getAddress(nami);
        let wallet_obj = {
            "address": address,
            "provider": "nami"
        };
        await addWallet(wallet_obj).then((res) => {
            jQuery.notify(
                {title: 'New Wallet Added', message: `Your Nami Wallet was successfully added.`, icon:'fas fa-check-circle'},
                  {
                    type: 'success',
                    delay: 5000,
                }
            );
            await getWallet().then(async res => {
                buildWallets(res);
            });
        }).catch(error => {
            console.log(error);
            jQuery.notify(
                {title: 'Walled Failed', message: `${error.info}`, icon:'fas fa-exclamation-circle'},
                  {
                    type: 'danger',
                    delay: 5000,
                }
              );
              nami_button.html('Retry');
              nami_button.removeAttr('disabled');
        });
    }).catch(error => {
        console.log(error);
        jQuery.notify(
            {title: 'Walled Failed', message: `${error.info}`, icon:'fas fa-exclamation-circle'},
              {
                type: 'danger',
                delay: 5000,
            }
          );
          nami_button.html('Retry');
          nami_button.removeAttr('disabled');
    });

});

async function getAddress(nami) {
    return new Promise(function(res,rej){
        nami.getUsedAddresses().then((response) => {
            const addr = wasm.Address.from_bytes(hexToBytes(response[0])).to_bech32();
            res(addr);
        }).catch(error => {
            rej(error);
        });
    });
}

async function getUtxos(nami) {
    return new Promise(function(res,rej){
        nami.getUtxos().then((response) => {
            let utxos = response.map((utxo) => wasm.TransactionUnspentOutput.from_bytes(hexToBytes(utxo)));
            let UTOXS=[]
            utxos.forEach(u => {
                let assets = utxoToAsset(u);
                UTOXS.push({
                    txHash: toHexString(u.input().transaction_id().to_bytes()),
                    txId: u.input().index(),
                    amount: assets
                });
            });
            res(UTOXS);
        }).catch(error => {
            rej(error);
        });
    });
}

function utxoToAsset(utxo) {
    let value = utxo.output().amount();
    const assets=[];
    assets.push({
        unit: 'lovelace',
        quantity: value.coin().to_str()
    });
    
    if(value.multiasset()) {
        const multiAssets = value.multiasset().keys();
        const enc = new TextDecoder("utf-8");
        for (let j = 0; j < multiAssets.len(); j++) {
            const policy = multiAssets.get(j);
            const policyAssets = value.multiasset().get(policy);
            const assetNames = policyAssets.keys();
            for (let k = 0; k < assetNames.len(); k++) {
                const policyAsset = assetNames.get(k);
                const quantity = policyAssets.get(policyAsset);
                const asset = toHexString(policy.to_bytes()) + "." +enc.decode(policyAsset.name());
                assets.push({
                    unit: asset,
                    quantity: quantity.to_str(),
                });
            }
        }
    }

    return assets;
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

async function addWallet(wallet_obj){
    return new Promise(function(res,rej){
        jQuery.ajax({
            url: 'https://blockchainsamurai.io/api/user/wallet',
            method: "POST",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(wallet_obj),
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
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
            "columnDefs": [{
                "targets": 3,
                "orderable": false
            }],
        });
    }
}