const { default: axios } = require("axios");

const apiURL = (route) => `https://xi.test.network${route}`;

const appRouter = function (app) {
  app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });

  app.get("/transactions/limit/:limit", async (req, res) => {
    try {
      const response = await axios.get(apiURL("/blocks"));
      const blocksList = response.data;
      const transactionList = [];
      blocksList.forEach((block) => {
        block.transactions.forEach((transaction) => {
          transaction.block = block.height;
        });
        transactionList.push(...block.transactions);
      });

      const limit =
        req.params.limit == 0 ? transactionList.length : req.params.limit;

      const transactions = transactionList
        .slice(0, limit)
        .sort((a, b) => b.timestamp - a.timestamp);

      return res.status(200).send({
        count: transactions.length,
        transactions,
      });
    } catch (e) {
      return res.status(e.status).send(e);
    }
  });

  app.get("/height", async (req, res) => {
    const response = await axios.get(apiURL("/blocks/latest"));
    return res.status(200).send({
      height: response.data.height,
    });
  });

  app.get("/blocks", async (req, res) => {
    const response = await axios.get(apiURL("/blocks"));
    let blocks = response.data.sort((a, b) => b.height - a.height);
    blocks.forEach((block) => {
      block.totalBlockValue = block.transactions
        .map((transaction) => transaction.value)
        .reduce((a, b) => a + b, 0);
    });

    return res.status(200).send({
      count: blocks.length,
      blocks,
    });
  });

  app.get("/block/:height", async (req, res) => {
    const heightParam = req.params.height;

    const height = parseInt(heightParam);

    if (isNaN(height)) {
      return res
        .status(404)
        .send({ error: true, message: "Please enter valid height" });
    }

    let blockResponse = await axios.get(apiURL(`/blocks/${height}`));

    let block = blockResponse.data;

    block.transactions.forEach((transaction) => {
      transaction.block = block.height;
    });

    return res.status(200).send(block);
  });

  app.get("/wallets/count", async (req, res) => {
    try {
      const response = await axios.get(apiURL("/wallets"));
      const wallets = response.data;
      const count = wallets.length;
      return res.status(200).send({
        count,
      });
    } catch (e) {
      return res.status(e).send({
        message: e.message,
      });
    }
  });

  app.get("/block/:height/transaction/:hash", async (req, res) => {
    const height = req.params.height;
    const hash = req.params.hash;
    try {
      const transactionResponse = await axios.get(
        apiURL(`/blocks/${height}/transactions/${hash}`)
      );

      const transaction = transactionResponse.data;

      return res.status(200).send(transaction);
    } catch (e) {
      return res.status(404).send({
        message: e.message,
      });
    }
  });

  app.get("/supply", async (req, res) => {
    try {
      const walletsResponse = await axios.get(apiURL("/wallets"));
      const wallets = walletsResponse.data;
      const supply = wallets
        .map((wallet) => wallet.balance)
        .reduce((a, b) => a + b, 0);

      return res.status(200).send({
        supply,
      });
    } catch (e) {
      return res.status(e).send({
        message: e.message,
      });
    }
  });

  app.post("/wallets", async (req, res) => {
    try {
      const response = await axios.get(apiURL("/wallets"));
      const wallets = response.data;

      const body = req.body;
      // page, limit
      if (Object.keys(body).length === 0) {
        return res.status(200).send({ wallets });
      }

      if (body.page < 0) {
        return res.status(404).send({
          message: "Page number should be greater than 0",
        });
      }

      if (body.limit < 0) {
        return res.status(404).send({
          message: "Limit should be greater than 0",
        });
      }

      const starting = (body.page - 1) * body.limit;
      const upToNotInclude = starting + body.limit;

      let walletList = wallets.slice(starting, upToNotInclude);

      return res.status(200).send({ wallets: walletList });
    } catch (e) {
      return res.status(404).send({
        message: e.message,
      });
    }
  });

  app.get("/wallet/:address", async (req, res) => {
    const address = req.params.address;
    try {
      const walletResponse = await axios.get(apiURL(`/wallets/${address}`));
      let wallet = walletResponse.data;
      wallet.testing = 0;

      let transactionList = [];

      const blocksResponse = await axios.get(apiURL("/blocks"));
      blocksResponse.data.forEach((block) => {
        let blockTransactionList = block.transactions;
        blockTransactionList.forEach((transaction) => {
          transaction.block = block.height;
        });
        transactionList.push(
          ...blockTransactionList.filter(
            (transaction) =>
              transaction.from === address || transaction.to === address
          )
        );
      });

      wallet.transactionList = transactionList;
      wallet.transactionCount = transactionList.length;

      return res.status(200).send(wallet);
    } catch (e) {
      return res.status(404).send({
        message: e.message,
      });
    }
  });
};

module.exports = appRouter;
