const { Stock } = require('../models/stock')
const { stockDataWithIndexes } = require('../config/stock')
const responseHelper = require("../helpers/response");
const redisClient = require('../config/redis/redis')
const RedisConfig = require('../config/redis/redis-functions')
const { keys } = require('../config/keys')

exports.initialStocks = async (req, res) => {
    try {
        let redis_key = keys.stock_key
        let check = await RedisConfig.checkForExistence(
            redis_key,
            "stock_data",
            stockDataWithIndexes
        );
        let msg = "Initial Stocks"
        responseHelper.sendSuccessResponseObject(stockDataWithIndexes, msg, res)
    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}

exports.priceHandler = async (req, res) => {
    try {
        let redis_key = keys.stock_key
        let newPriceValue = req.body.price
        redisClient.hgetall(redis_key, async (err, data) => {
            let parseData = JSON.parse(data.stock_data)
            let oldStock = parseData[req.body.index]
            let updatedStock = new Stock(
                oldStock.symbol,
                oldStock.type,
                oldStock.lastDividend,
                oldStock.fixedDividend,
                oldStock.parValue,
                parseFloat(newPriceValue),
                oldStock.dividendYield,
                oldStock.peRatio,
                oldStock.VWSPrice)
            parseData[req.body.index] = updatedStock
            let check = await RedisConfig.checkForExistence(
                redis_key,
                "stock_data",
                parseData
            );
            let msg = "Initial Stocks"
            responseHelper.sendSuccessResponseObject(updatedStock, msg, res)
        })
    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}

exports.getUpdatedStocks = async (req, res) => {
    try {
        let redis_key = keys.stock_key
        redisClient.hgetall(redis_key, async (err, data) => {
            let parseData = JSON.parse(data.stock_data)
            let msg = "Updated Stocks"
            responseHelper.sendSuccessResponseObject(parseData, msg, res)
        })

    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}

