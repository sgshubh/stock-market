const express = require("express");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDOC = require("./swagger.json");
const Stocks = require('./routes/stock')
const Trades = require('./routes/trade')
const PORT = 3030
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 1000000 }));
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDOC));
app.use('/', Stocks)
app.use('/', Trades)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} successfully`);
});
