const Web3 = require("web3");
const {getRandomRPC} = require("./rpc");
const DAI_ABI = require('./ABI/DAI_ABI.json')
const Action = require("./action");

function listenToContract(contractAddress) {
    const RPC = getRandomRPC()
    const web3 = new Web3(RPC)

    const contract = new web3.eth.Contract(DAI_ABI, contractAddress);

    contract.events.allEvents({fromBlock: 'latest'})
        .on('data', Action.onData.bind(this, contractAddress))
        .on('error', Action.onError);
}

module.exports = {
    listenToContract
}
