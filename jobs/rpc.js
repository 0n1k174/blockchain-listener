const RPC_WS_URLS = [
    'wss://eth-mainnet.g.alchemy.com/v2/bpxgI9LDf0kWE_ha7Q2kVPcWlFP1-YJx',
    'wss://eth-mainnet.g.alchemy.com/v2/bQJ3F-CEsK4uNtd3lwJ7E59hL-eKogcR'
]
const RPC_URLS = [
    'https://eth-mainnet.g.alchemy.com/v2/bQJ3F-CEsK4uNtd3lwJ7E59hL-eKogcR',
    'https://eth-mainnet.g.alchemy.com/v2/bpxgI9LDf0kWE_ha7Q2kVPcWlFP1-YJx'
]

/**
 *
 * @param {"WS"|"HTTPS"}type
 */
function getRandomRPC(type = "WS") {
    const RPC_ARRAY = type === "WS" ? RPC_WS_URLS : RPC_URLS;

    const index = Math.floor(Math.random() * RPC_ARRAY.length);
    return RPC_ARRAY[index]
}

module.exports = {
    getRandomRPC
}
