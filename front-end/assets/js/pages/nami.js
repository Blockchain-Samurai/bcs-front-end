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
            data: JSON.stringify(wallet_obj),
        }).then(response => {
            res(response);
        }).catch(error => {
            rej(error);
        })
      });
}