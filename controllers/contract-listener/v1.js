const ContractListenerV1 = require("../../modules/contract-listener/v1");
const ApiLimiter = require("../../modules/api-limiter");

async function get(req, res) {
    try {
        const {
            contractAddress,
            sender,
            recipient,
            fromBlock,
            toBlock,
            limit,
            skip
        } = req.query;

        const settings = {
            contractAddress,
            sender,
            recipient,
            fromBlock: Number(fromBlock) || 0,
            toBlock: Number(toBlock) || 0,
            limit: Math.min(Number(limit || 100), 100),
            skip: Number(skip) || 0
        }

        await ApiLimiter.checkAndUpdateLimit(req.headers['token'], ApiLimiter.Actions.Transactions)

        const data = await ContractListenerV1.getTransactions(settings)
        res.json({
            success: true,
            data
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

async function getBalance(req, res) {
    try {


        const {
            contractAddress,
            address,
            real
        } = req.query;

        const settings = {
            contractAddress,
            address,
            real: Boolean(real)
        }

        await ApiLimiter.checkAndUpdateLimit(req.headers['token'], ApiLimiter.Actions.Balance);

        const data = await ContractListenerV1.getBalance(settings)
        res.json({
            success: true,
            data
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    get,
    getBalance
}
