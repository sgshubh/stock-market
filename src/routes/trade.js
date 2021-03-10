const express = require("express");
const route = express.Router();
const Trade = require('../controllers/trade')

route.get('/getInitialTrades', Trade.initialTrade)
route.post('/createNewTrade', Trade.createTrade)
route.get('/updatedTrade', Trade.getUpdatedTrade)
route.get('/getMean', Trade.getGeometryMean)

module.exports = route;

