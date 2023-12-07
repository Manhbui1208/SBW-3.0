const {RNG_between} = require('../Scripts/Common')
const {RNG_acc} = require('../Scripts/RNG_acc')
const {send_tx} = require('../Scripts/Send_tx')
//const config = require('./ABI_bytecode')
// const Web3 = require('web3');

// const web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.51.151:8545'));



async function Tx () {
	const account_1 = RNG_acc();
	// console.log(account_1);

	const account_2 = RNG_acc();
	// console.log(account_2);

	send_tx('tx', account_1, null, null, '', account_2, RNG_between(1e10, 1e18), false)
}

setInterval(async () => {
	Tx();
}, 3000);



// const account_1 = RNG_acc();
// const account_2 = RNG_acc();

// const transaction = {
// 	"from" : account_1.pub_key,
//     "to" : account_2.pub_key, 
//     "value" : web3.utils.toWei('1', 'ether'),
//     "data" : '0x',
// 	"gasPrice" : web3.utils.toHex(web3.utils.toWei('1','gwei')),
// 	"gasLimit" : web3.utils.toHex(10000000),
// };

// // Ước lượng gas
// web3.eth.estimateGas(transaction)
//     .then(gasAmount => {
//         console.log('Ước lượng gas cần thiết:', gasAmount);
//     })
//     .catch(error => {
//         console.error('Lỗi ước lượng gas:', error);
//     });