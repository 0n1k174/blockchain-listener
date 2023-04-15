const {cacheCollections} = require("../contract-listener/v1/cache");

function initialCache() {
    Promise.allSettled([cacheCollections()]).catch()
}

module.exports = {
    initialCache
}
