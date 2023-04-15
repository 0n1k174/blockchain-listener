require('dotenv').config()

const express = require('express')
const Connection = require('./db/main')
const app = express()

const rateLimit = require("express-rate-limit");

const ApiLimiter = require("./modules/api-limiter");

// info: Adding jobs here but ideally they need to be in another repo
const Jobs = require('./jobs/index')
const CacheV1 = require("./modules/cache");

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10000, // 10K requests for 1h timeframe per ip, but better to be done by cloudflare
    message: "Too many requests from this IP. Please try later."
});

app.use('/', limiter);

app.use('/v1/contract-listener', ApiLimiter.check, require('./routes/contract-listener/v1/index'))
app.use('/queries', require('./routes/queries/index'))

Connection.connect().then(() => {

    CacheV1.initialCache();
    Jobs.listenToContract('0x6b175474e89094c44da98b954eedeac495271d0f') // hardcoded dai contract

    app.listen(process.env.PORT, () => {
        console.log(`App running on port ${process.env.PORT}`)
    })
})
