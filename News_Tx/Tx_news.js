const path = require('path');
const Web3 = require('web3');
const {RNG_acc, Select_acc} = require('../Scripts/RNG_acc');
const {send_tx} = require('../Scripts/Send_tx');
const {sleep, RNG_between, RNG_inputs, RNG_addr, RNG_str} = require('../Scripts/Common');
const conf = require('../config')
const config = require('./ABI_bytecode')

const web3 = new Web3(new Web3.providers.HttpProvider(conf.HttpProvider));

const SM_addr = '0xd5331F08F6F6423e26DfaC05a2ea129e52c5936a';
users = RNG_acc();
console.log(users.pub_key)

async function News_Tx() {

    text = '\'' + 'Hello this is news from new users' + '\''
    bool = false
    input = [text, bool].join(',')
    send_tx('tx', users, config, input, 'addTweet', SM_addr)
}

News_Tx()