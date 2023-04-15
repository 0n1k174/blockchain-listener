const Connection = require('../../../db/main')

const CONTRACT_COLLECTIONS = {}


async function cacheCollections() {
    try {
        const collections = await Connection.db.listCollections().toArray()
        for (const collection of collections) {
            CONTRACT_COLLECTIONS[collection.name] = true;
        }
        console.log(`Successfully cached collections list, Total - ${collections.length}`)

    } catch (error) {
        console.log(`Error while caching collections list: ${error.message}`)
        setTimeout(cacheCollections, 10000);
    }
}

/**
 *
 * @param {string}contractAddress
 * @returns {string} - the collection name
 */
function checkTransactionsCollection(contractAddress) {
    const contractLowercase = (contractAddress || "").toLowerCase()
    const collectionName = `Events_${contractLowercase}`;
    return CONTRACT_COLLECTIONS[collectionName] ? collectionName : undefined;
}


module.exports = {
    cacheCollections,
    checkTransactionsCollection
}
