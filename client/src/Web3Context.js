import React, {createContext, useState, useEffect} from "react";
import Web3 from 'web3'

const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tweetId",
				"type": "uint256"
			}
		],
		"name": "AddTweet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tweetId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isDeleted",
				"type": "bool"
			}
		],
		"name": "DeleteTweet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tweetText",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isDeleted",
				"type": "bool"
			}
		],
		"name": "addTweet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tweetId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isDeleted",
				"type": "bool"
			}
		],
		"name": "deleteTweet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tweetId",
				"type": "uint256"
			}
		],
		"name": "getTweet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export const Web3Context = createContext();

export const Web3Provider = ({children}) => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [tweets, setTweets] = useState([]); //Save tweets

    useEffect(() => {
        const initWeb3 = async () => {
            try {
             //Config Web3 and Contract
            const web3Instance = new Web3(new Web3.providers.WebsocketProvider(''))
            const contractInstance = new web3Instance.eth.Contract(ABI, '0xd5331F08F6F6423e26DfaC05a2ea129e52c5936a')

            setWeb3(web3Instance);
            setContract(contractInstance);
            } catch (error) {
                console.error(error);
            }
        };

        initWeb3();
    }, []);

    //Listen AddTweet event and update Tweet list
    useEffect(() => {
        const updateTweetsOnNewTweet = (tweetId) => {
            //Call getTweet
            contract.methods.getTweet(tweetId).call()
                .then(tweetDetails => {
                    setTweets(prevTweets => [...prevTweets, tweetDetails]);
                })
                .catch(console.error);
        };

        if (contract) {
            contract.events.AddTweet({
                fromBlock: 'latest'
            })
            .on('data', event => {
                const tweetId = event.returnValues.tweetId;
                updateTweetsOnNewTweet(tweetId);
                console.log('Event received:',event)
            })
            .on('error', console.error);
        }
    }, [contract]);

    return (
        <Web3Context.Provider value={{ web3, contract, tweets }}>
            {children}
        </Web3Context.Provider>
    );
};
