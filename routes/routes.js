const { default: axios } = require("axios");
const walletController = require("../controllers/walletController");
const blockController = require("../controllers/blockController");

const apiURL = (route) => `https://xi.test.network${route}`;

const appRouter = function (app) {
  app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });

  //   Block Controller
  app.get("/transactions/limit/:limit", blockController.getTransactions);
  app.get("/height", blockController.getBlockHeight);
  app.get("/blocks", blockController.getBlocks);
  app.get("/block/:height", blockController.getBlockInfo);

  app.get(
    "/block/:height/transaction/:hash",
    blockController.getTransactionInfo
  );

  //   Wallet Controller
  app.get("/supply", walletController.getCirculatingSupply);
  app.get("/wallets/count", walletController.getCount);
  app.post("/wallets", walletController.getWallets);
  app.get("/wallet/:address", walletController.getAddressDetail);
};

module.exports = appRouter;
