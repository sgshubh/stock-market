const { Trade } = require('../models/trade')
const { Stock, stockTypes } = require('../models/stock')
const { tradeData } = require('../config/trade')
const responseHelper = require("../helpers/response");
const redisClient = require('../config/redis/redis')
const RedisConfig = require('../config/redis/redis-functions')
const { keys } = require('../config/keys')

exports.initialTrade = async (req, res) => {
    try {
        let redis_key = keys.trade_key
        let trades = []
        let check = await RedisConfig.checkForExistence(
            redis_key,
            "trade_data",
            trades
        );
        let msg = "Initial Trades"
        responseHelper.sendSuccessResponseObject(tradeData, msg, res)
    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}

exports.createTrade = async (req, res) => {
    try {
        let redis_key = keys.stock_key
        let trades = []
        redisClient.hgetall(redis_key, async (err, data) => {
            let parseData = JSON.parse(data.stock_data)
            const stock = parseData.filter(stock => stock.symbol === req.body.stockSymbol)[0];
            if (stock.price > 0) {
                const trade = new Trade(
                    stock.symbol,
                    req.body.quantity,
                    req.body.action,
                    stock.price
                );
                this.updateStockVWSPrice(stock, trade);
                redisClient.hgetall(keys.trade_key, async (err, prev_trade) => {

                    let fetchData = JSON.parse(prev_trade.trade_data)
                    fetchData.push(trade)
                    let check = await RedisConfig.checkForExistence(
                        keys.trade_key,
                        "trade_data",
                        fetchData
                    );
                    let msg = "Trade Created";
                    responseHelper.sendSuccessResponseObject(fetchData, msg, res);
                })

            }
            else {
                let msg = "Missing price from selected stock for new trade form";
                responseHelper.sendFailureResponseObject({}, msg, res);
            }
        })

    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}

exports.getUpdatedTrade = async (req, res) => {
    try {
        let redis_key = keys.trade_key
        redisClient.hgetall(redis_key, async (err, data) => {
            let parseData = JSON.parse(data.trade_data)
            let msg = "Updated Trade"
            responseHelper.sendSuccessResponseObject(parseData, msg, res)
        })

    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}

exports.updateStockVWSPrice = (stock, trade) => {
    const updatedStock = new Stock(
        stock.symbol,
        stock.type,
        stock.lastDividend,
        stock.fixedDividend,
        stock.parValue,
        stock.price,
        stock.dividendYield,
        stock.peRatio,
        stock.VWSPrice
    );
    redisClient.hgetall(keys.trade_key, async (err, data) => {
        let parseTrade = JSON.parse(data.trade_data)
        const trades = this.getLatestStockTrades(parseTrade.concat(trade), stock.symbol);
        updatedStock.calculateVWSPrice(trades);
        redisClient.hgetall(keys.stock_key, async (err, data) => {
            let parseData = JSON.parse(data.stock_data)
            const findIndex = parseData.findIndex(e => e.symbol === stock.symbol);
            parseData[findIndex] = updatedStock
            const newGeometricMean = this.calculateGeometricMean(parseData);
            console.log("Mean", newGeometricMean)
            let check1 = await RedisConfig.checkForExistence(
                keys.geometric_key,
                "geometric_mean",
                newGeometricMean
            );
            let check = await RedisConfig.checkForExistence(
                keys.stock_key,
                "stock_data",
                parseData
            );
            return
        })
    })
}

exports.calculateGeometricMean = (stocks) => {
    let stocksVWSPrice = null;
    let stockAmount = 0;
    if (stocks && stocks.length > 0) {
        for (let x = 0; x < stocks.length; x++) {
            console.log(stocks[x].VWSPrice)
            if (stocks[x].VWSPrice !== '-') {
                stocksVWSPrice = stocksVWSPrice ? stocksVWSPrice *= stocks[x].VWSPrice : stocks[x].VWSPrice;
                stockAmount++;
            }
        }
    }
    return stockAmount > 0 ? Math.pow(stocksVWSPrice, 1 / stockAmount) : null;
}

exports.getLatestStockTrades = (trades, stockSymbol) => {
    return trades.filter(trade =>
        trade.stockSymbol === stockSymbol &&
        this.getDiferenceInMinutes(new Date(trade.timestamp), new Date()) <= 5
    );


}

exports.getDiferenceInMinutes = (date1, date2) => {
    const diff = (date1.getTime() - date2.getTime()) / 60000;
    return Math.abs(Math.round(diff));
}

exports.getGeometryMean = async (req, res) => {
    try {
        let redis_key = keys.geometric_key
        redisClient.hgetall(redis_key, async (err, data) => {
            let parseData = data == null ? 'Not Available' : JSON.parse(data.geometric_mean)
            let msg = "Geometric Mean"
            responseHelper.sendSuccessResponseObject(parseData, msg, res)
        })

    }
    catch (err) {
        let data = { error: err.message };
        let msg = "Something went wrong.";
        responseHelper.sendFailureResponseObject(data, msg, res);
    }
}