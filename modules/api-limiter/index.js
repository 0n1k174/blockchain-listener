const Connection = require('../../db/main')

const Actions = {
    Transactions: 'transactions',
    Balance: 'balance'
}

const ActionWeight = {
    [Actions.Transactions]: 100,
    [Actions.Balance]: 50
}

const TokenDailyLimit = 3500;

async function check(req, res, next) {
    const token = req.headers['token']
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token is missing'
        })
    }

    const info = await Connection.db.collection('Token').findOne({_id: token})
    if (!info) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        })
    }

    next()
}

async function checkAndUpdateLimit(token, action) {
    const date = new Date(Date.now() - (24 * 60 * 60 * 1000));
    const actions = await Connection.db.collection('Token_Actions').find({token, date: {$gt: date}}).toArray();

    const actionsWeightSum = actions.reduce((accumulator, item) => {
        accumulator += ActionWeight[item.action]
        return accumulator;
    }, 0)

    if (actionsWeightSum > TokenDailyLimit) {
        throw Error('Your credits expired for today, please upgrade your plan')
    }

    await Connection.db.collection('Token_Actions').insertOne({
        token,
        action,
        date: new Date()
    });
}


module.exports = {
    Actions,
    check,
    checkAndUpdateLimit
}
