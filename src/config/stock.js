const { stockTypes, stockSymbols } = require('../models/stock')


const stockDataWithIndexes = [
    {
        index: 0,
        symbol: stockSymbols.TEA,
        type: stockTypes.common,
        lastDividend: '-',
        fixedDividend: '-',
        parValue: 100,
        price: '',
        dividendYield: '-',
        peRatio: '-',
        VWSPrice: '-'

    },
    {
        index: 1,
        symbol: stockSymbols.POP,
        type: stockTypes.common,
        lastDividend: 8,
        fixedDividend: '-',
        parValue: 100,
        price: '',
        dividendYield: '-',
        peRatio: '-',
        VWSPrice: '-'
    },
    {
        index: 2,
        symbol: stockSymbols.ALE,
        type: stockTypes.common,
        lastDividend: 23,
        fixedDividend: '-',
        parValue: 60,
        price: '',
        dividendYield: '-',
        peRatio: '-',
        VWSPrice: '-'
    },
    {
        index: 3,
        symbol: stockSymbols.GIN,
        type: stockTypes.preferred,
        lastDividend: 8,
        fixedDividend: 2,
        parValue: 100,
        price: '',
        dividendYield: '-',
        peRatio: '-',
        VWSPrice: '-'
    },
    {
        index: 4,
        symbol: stockSymbols.JOE,
        type: stockTypes.common,
        lastDividend: 13,
        fixedDividend: '-',
        parValue: 250,
        price: '',
        dividendYield: '-',
        peRatio: '-',
        VWSPrice: '-'
    }
]

module.exports = { stockDataWithIndexes }