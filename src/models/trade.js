class Trade {
    constructor(stockSymbol, quantity, action, price) {
        this.stockSymbol = stockSymbol;
        this.quantity = quantity;
        this.action = action;
        this.price = price;
        this.totalPrice = quantity * price
        this.timestamp = new Date();
    }
}

const actionTypes = {
    BUY: 'Buy',
    SELL: 'Sell'
}


module.exports = { Trade, actionTypes }