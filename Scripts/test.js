const { Web3 } = require('web3');
const Tran = require('ethereumjs-tx').Transaction
const Common = require('ethereumjs-common').default
const fsp  = require("fs").promises;
const ethers = require('ethers')



const web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.51.151:8545'))
//const web3 = new Web3('http://192.168.51.151:8545')

private_Geth = Common.forCustomChain('mainnet', {
    name: 'private_Geth',
    networkId: 1,
    chainId: 2023,
    },
    'petersburg',
)

async function send_tx(account, data, method, args, _to, _value, _log) {
    let rawTx = {}
    let pub_key = account.pub_key;
    let pri_key = account.pri_key;
    let res = {};

    if (data == null) {
        txCount = await web3.eth.getTransactionCount(pub_key, 'pending');

        rawTx = {
            to: _to.pub_key,
            from: pub_key,
            nonce: web3.utils.toHex(txCount),
            value: _value,
            gasLimit: web3.utils.toHex(100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('1','gwei'))
        }
    }

    const tx = new Tran(rawTx, {common: private_Geth});
    tx.sign(Buffer.from(pri_key, 'hex'));
    const serial = tx.serialize();
    const raw = '0x' + serial.toString('hex');    

    let Hash = 0
    await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        if(err) {
            console.log(err);
        }
        _log && console.log('Transaction hash:',txHash);
        Hash = txHash;
    })
    let receipt = await web3.eth.getTransactionReceipt(Hash);

    res.txHash = Hash;
    res.logs = receipt.logs;
}



async function createAccount(){
    var wallet = await web3.eth.accounts.create();
    console.log('Address:' + wallet.address);
    console.log('Private Key: ' + wallet.privateKey.substring(2));
    return wallet;
}

async function Save_acc(data) {
    try{
        await fsp.appendFile("./acc_list.csv", data, 'utf8');
    } catch (e) {
        console.log(e);
    }
}

let account = {}
account.pub_key = '0x123463a4b065722e99115d6c222f267d9cabb524';
account.pri_key = '2e0834786285daccd064ca17f1654f67b4aef298acbb82cef9ec422fb4975622'

// console.log(account)

async function execute() {
    try {
        const wallet = await createAccount();
        const output = await send_tx(account, null, null, '', wallet, web3.utils.toHex(web3.utils.toWei('1', 'ether')));
        
        let data = wallet.address.toString() + ',' + wallet.privateKey.substring(2) + '\n';
        Save_acc(data);
    } catch (e) {
        console.error(e);
    }
}

execute();
// web3.eth.getBalance(account.pub_key).then(balance => {
//     console.log(balance);
// }).catch(error => {
//     console.error(error);
// });

