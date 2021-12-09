const { default: axios } = require("axios");
const WalletController = require("../controllers/wallet.controller");
const BlockController = require("../controllers/block.controller");
const TransactionController = require("../controllers/transaction.controller");

const appRouter = function (app) {
  app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });

  //   Block Controller
  app.get("/height", BlockController.getBlockHeight);
  app.get("/blocks", BlockController.getBlocks);
  app.get("/block/:height", BlockController.getBlockInfo);

  // Transaction Controller
  app.post("/transactions", TransactionController.getTransactions);
  app.post("/transaction", TransactionController.getTransactionInfo);

  //   Wallet Controller
  app.get("/supply", WalletController.getCirculatingSupply);
  app.get("/wallets/count", WalletController.getCount);
  app.post("/wallets", WalletController.getWallets);
  app.post("/wallet", WalletController.getAddressDetail);
};

module.exports = appRouter;
