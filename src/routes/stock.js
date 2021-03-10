const express = require("express");
const route = express.Router();
const Stocks = require('../controllers/stock')

route.get('/getInitialStocks', Stocks.initialStocks)
route.post('/priceHandler', Stocks.priceHandler)
route.get('/updatedData', Stocks.getUpdatedStocks)


module.exports = route;

