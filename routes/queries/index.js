// as this is a not the main task I will just write here without all the standards
// note that as I added weights that can also be used here

const Connection = require('../../db/main')
const {Router} = require('express');

const router = Router();

router
    .get('/avg-per-timeframe', async (req, res) => {
        try {

            const {startDate, endDate} = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Both startDate and endDate are required'
                })
            }

            const query = {
                date: {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate)
                }
            }

            const avg = await Connection.db.collection('Token_Actions').aggregate([
                    {
                        $match: query
                    },
                    {
                        '$group': {
                            '_id': '$token',
                            'count': {
                                '$sum': 1
                            }
                        }
                    }, {
                        '$group': {
                            '_id': null,
                            'average': {
                                '$avg': '$count'
                            }
                        }
                    }
                ]
            ).toArray()
            return res.json({
                success: true,
                avg
            })
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            })
        }
    })
    .get('/sum', async (req, res) => {
        try {

            const {startDate, endDate} = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Both startDate and endDate are required'
                })
            }

            const query = {
                date: {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate)
                }
            }

            const count = await Connection.db.collection("Token_Actions").countDocuments(query)
            return res.json({
                success: true,
                count
            })
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            })
        }
    })
    .get('/high-time-frame', async (req, res) => {
        try {

            const {startDate, endDate, token} = req.query;
            if (!startDate || !endDate || !token) {
                return res.status(400).json({
                    success: false,
                    message: 'startDate, endDate and token are required'
                })
            }

            const query = {
                date: {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate)
                },
                token
            }

            const count = await Connection.db.collection("Token_Actions").aggregate([
                {
                    '$match': query
                },
                {
                    '$group': {
                        '_id': {
                            '$hour': '$date'
                        },
                        'totalRequests': {
                            '$sum': 1
                        }
                    }
                }, {
                    '$sort': {
                        'totalRequests': -1
                    }
                }
            ]).toArray()
            return res.json({
                success: true,
                count: count[0]
            })
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            })
        }
    })
    .get('/most-used', async (req, res) => {
        try {

            const count = await Connection.db.collection("Token_Actions").aggregate([
                {$group: {_id: "$token", count: {$sum: 1}}},
                {$sort: {count: -1}},
                {$limit: 1}
            ]).toArray()
            return res.json({
                success: true,
                token: count[0]
            })
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            })
        }
    })


module.exports = router;
