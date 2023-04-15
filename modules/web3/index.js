const Web3 = require("web3");
const {getRandomRPC} = require("../../jobs/rpc");
const DAI_ABI = require("../../jobs/ABI/DAI_ABI.json");

async function getBalance(contractAddress, address) {
    try {
        const RPC = getRandomRPC("HTTPS")
        const web3 = new Web3(RPC)

        const contract = new web3.eth.Contract(DAI_ABI, contractAddress);
        const balance = await contract.methods.balanceOf(address).call()
        return Number(balance);
    } catch (error) {
        console.error(error)
        return undefined;
    }
}

async function getDecimals(contractAddress) {
    try {
        const RPC = getRandomRPC("HTTPS")
        const web3 = new Web3(RPC)

        const contract = new web3.eth.Contract(DAI_ABI, contractAddress);
        const decimals = await contract.methods.decimals().call()
        return Number(decimals);
    } catch (error) {
        console.error(error)
        return undefined;
    }
}

module.exports = {
    getDecimals,
    getBalance
}
