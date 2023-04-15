const Connection = require("../db/main");

async function onData(contractAddress, data) {

    const contractLowecased = contractAddress.toLowerCase()

    const parsed = {
        block: data.blockNumber,
        hash: data.transactionHash,
        event: data.event
    }

    if (data.returnValues) {
        if (data.returnValues.src) {
            parsed.sender = data.returnValues.src.toLowerCase();
        }
        if (data.returnValues.dst) {
            parsed.recipient = data.returnValues.dst.toLowerCase();
        }
        if (data.returnValues.wad) {
            // Saving string is better for some contracts. If the number will be too large, because of js number, it will cause inaccuracy
            parsed.value = data.returnValues.wad;
        }
    }

    Connection.db.collection(`Events_${contractLowecased}`)
        .insertOne(parsed)
        .then(() => {
            console.log(`Inserted - ${parsed.hash}`);
        })
        .catch(error => {
            console.log(`Insert error| ${error.message}`)
        })
}

async function onError(error) {
    console.error(error)
}

module.exports = {
    onData,
    onError
}
