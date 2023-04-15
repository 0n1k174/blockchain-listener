const ContractCache = require("./cache");
const Connection = require('../../../db/main')
const Web3API = require("../../web3");

/**
 *
 * @param {{
 *             contractAddress: string,
 *             fromBlock: number,
 *             toBlock: number,
 *             sender: string,
 *             recipient: string,
 *             limit: number,
 *             skip: number
 *             }}settings
 * @returns any
 */
async function getTransactions(settings) {

    const collectionName = ContractCache.checkTransactionsCollection(settings.contractAddress)
    if (!collectionName) {
        throw Error('Contract history is not supported')
    }

    const query = {}
    if (settings.fromBlock) {
        query.block = {
            ...(query.block || {}),
            $gt: settings.fromBlock
        }
    }

    if (settings.toBlock) {
        query.block = {
            ...(query.block || {}),
            $lte: settings.toBlock
        }
    }

    if (settings.sender) {
        query.sender = settings.sender.toLowerCase()
    }

    if (settings.recipient) {
        query.recipient = settings.recipient.toLowerCase()
    }

    const limit = settings.limit;
    let skip = settings.skip;

    let transactions = {};
    const eventsCursor = Connection.db.collection(collectionName).find(query).project({_id: 0}).sort({block: -1})

    while (true) {
        const event = await eventsCursor.next();
        if (!event) {
            break;
        }

        if (!transactions[event.hash]) {

            if (Number.isFinite(skip) && Object.keys(transactions).length === skip) {
                transactions = {};
                skip = null;
            }

            if (limit && Object.keys(transactions).length === limit) {
                break;
            }

            transactions[event.hash] = {
                hash: event.hash,
                block: event.block,
                events: [event]
            }
        } else {
            transactions[event.hash].events.push(event)
        }
    }

    return Object.values(transactions);
}


/**
 *
 * @param {{
 *          contractAddress: string,
 *          address: string,
 *          [real]: boolean
 *          }}settings
 * @returns {Promise<void>}
 */
async function getBalance(settings) {
    const collectionName = ContractCache.checkTransactionsCollection(settings.contractAddress)
    if (!collectionName) {
        throw Error('Contract history is not supported')
    }

    if (settings.real) {
        return Web3API.getBalance(settings.contractAddress, settings.address)
    }

    const query = {
        event: "Transfer",
        $or: [{sender: settings.address}, {recipient: settings.address}]
    }

    const decimals = await Web3API.getDecimals(settings.contractAddress)
    if (decimals === undefined) {
        throw Error('Error with RPC, could not get decimals');
    }

    // info: it's always better that the job updates realtime balances on another table but as written in task, will just sum here and return
    let balance = 0;
    await Connection.db.collection(collectionName).find(query).project({_id: 0, block: 0, hash: 0}).forEach(event => {
        if (event.sender && event.value) {
            const isSender = event.sender.toLowerCase() === settings.address.toLowerCase()
            const value = Number(event.value) / Math.pow(10, decimals)
            balance += (isSender ? -value : value);
        }
    })

    return balance;
}

module.exports = {
    getTransactions,
    getBalance
}
