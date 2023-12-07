const Web3 = require('web3')
const Tran = require('ethereumjs-tx').Transaction
const Common = require('ethereumjs-common').default 
const ethers = require('ethers')
const conf = require('../config')
//ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF)

// Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider(conf.HttpProvider));
const private_Geth = conf.private_Geth;

let tx_types = {'tx': 'tx', 'sm': 'sm'}

module.exports = { 
    send_tx: function (tx_type, account, data, args=null, method=null, _to=null, _value=null, _log=true) {
        let res = {}
        switch(tx_type) {
            case('tx'): {
                res = send_transaction(account, data, method, args, _to, _value, _log)
                break
            }
            case('sm'): {
                res = deploy_sm (account, data, args, _log)
                break
            }
        }
        return res
    }
}

async function deploy_sm (account, data, args, _log) {

    let ABI = data.ABI;
    let bytecode = data.bytecode;
    let pub_key = account.pub_key;
    let pri_key = account.pri_key;

    let res = {};
    const SM = new web3.eth.Contract(ABI)

    let options = {}
    if (args == null)
        options = {
            data: '0x' + bytecode
        } 
    else
        options = {
            data: '0x' + bytecode,
            arguments: args,
        }

    // Gas estimation
	let gasEstimate = 10000000
    try {
        gasEstimate = await SM.deploy(options).estimateGas() + 1e5;
    } catch(e) {
        console.log('Using the default gas value.')
    }
    
	txCount = await web3.eth.getTransactionCount(pub_key, 'pending');
    
    const transaction = await SM.deploy(options).encodeABI();
    if (args != null) 
        rawTx = {
            nonce: web3.utils.toHex(txCount),
            data: transaction,
            arguments: [args],
            gas: web3.utils.toHex(gasEstimate),
            from: pub_key,
            gasLimit: web3.utils.toHex(10000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('1','gwei'))
        }
    else
        rawTx = {
            nonce: web3.utils.toHex(txCount),
            data: transaction,
            gas: web3.utils.toHex(gasEstimate),
            from: pub_key,
            gasLimit: web3.utils.toHex(10000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('1','gwei'))
        }

	let tx = new Tran(rawTx, {common: private_Geth});
	tx.sign(Buffer.from(pri_key, 'hex'));
	let serial = tx.serialize();
	let raw = '0x' + serial.toString('hex');
	
	let SM_hash = 0
	await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
		if(err)	{
			console.log(err);
		}
		_log && console.log('Transaction hash:', txHash);
		SM_hash = txHash;
	})
	let receipt = await web3.eth.getTransactionReceipt(SM_hash);
	_log && console.log('Contract address: ' + receipt.contractAddress);

    res.SM_hash         = SM_hash;
    res.contractAddress = receipt.contractAddress;
    return res;
}

async function send_transaction (account, data, method, args, _to, _value, _log) {
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
    else {
        let ABI = data.ABI;
        let bytecode = data.bytecode;
        // let pub_key = account.pub_key;
        // let pri_key = account.pri_key;

        const SM = new web3.eth.Contract(ABI, _to)
        let dataTx = ''
        if (args != null)
            dataTx = 'SM.methods.' + method + '(' + args + ').encodeABI();'
        else
            dataTx = 'SM.methods.' + method + '().encodeABI();'
        dataTx = eval(dataTx)

        txCount = await web3.eth.getTransactionCount(pub_key, 'pending');

        rawTx = {
            to: _to,
            from: pub_key,
            nonce: web3.utils.toHex(txCount),
            data: dataTx,
            value: _value,
            gasLimit: web3.utils.toHex(10000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('1','gwei'))
        }
    }
    const tx = new Tran(rawTx, {common: private_Geth});
    tx.sign(Buffer.from(pri_key, 'hex'));
    const serial = tx.serialize();
    const raw = '0x' + serial.toString('hex');

    let Hash = 0
    await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        if(err)	{
            console.log(err);
        }
        _log && console.log('Transaction hash:', txHash);
        Hash = txHash;
    })
    let receipt = await web3.eth.getTransactionReceipt(Hash);
    
    res.txHash      = Hash;
    res.logs        = receipt.logs;
    return res;
}