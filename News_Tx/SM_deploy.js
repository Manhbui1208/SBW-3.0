const config = require('./ABI_bytecode')
const {RNG_acc} = require('../Scripts/RNG_acc')
const {send_tx} = require('../Scripts/Send_tx');

const account = RNG_acc();
console.log(account);

send_tx('sm', account, config)

//Contract address: 0xd5331F08F6F6423e26DfaC05a2ea129e52c5936a
//Owner addr: '0xDFb13792A620bd3C77f2971EB44f18D6Ac74d55C'