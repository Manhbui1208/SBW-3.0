Common = require('ethereumjs-common').default

config = {}

config.HttpProvider = 'http://192.168.51.151:8545'

config.WebsocketProvider = 'ws://192.168.51.151:8546'

config.private_Geth = Common.forCustomChain('mainnet', {
	name: 'private_Geth',
	networkId: 1,
	chainId: 2023,
	},
	'petersburg',
);

config.await = 3000 

config.time_slot = 12000 // Ethereum 2.0's block time

module.exports = config;