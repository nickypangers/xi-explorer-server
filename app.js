const express = require("express");
const app = express();
// const BlockRoutes = require("./routes/block.route");
// const WalletRoutes = require("./routes/wallet.route");
// const TransactionRoutes = require("./routes/transaction.route");
const routes = require("./routes/routes");
const cors = require("cors");
const port = process.env.PORT || 3030;

app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
