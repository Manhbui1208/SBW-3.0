const keythereum = require("keythereum");
const datadir = './'
const address= "0x123463a4b065722e99115d6c222f267d9cabb524";
const password = "";
const passwordBuffer = Buffer.from(password);


var keyObject = keythereum.importFromFile(address, datadir);
console.log(keyObject);
var privateKey = keythereum.recover(passwordBuffer, keyObject);
console.log(privateKey.toString('hex'));