const { default: axios } = require("axios");

const apiURL = (route) => `https://xi.test.network${route}`;

const appRouter = function (app) {
  app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });

  app.get("/transactions/limit/:limit", async (req, res) => {
    const limit = req.params.limit || 10;
    const response = await axios.get(apiURL("/blocks"));
    const blocksList = response.data;
    const transactionList = [];
    blocksList.forEach((block) => {
      block.transactions.forEach((transaction) => {
        transaction.block = block.height;
      });
      transactionList.push(...block.transactions);
    });
    const transactions = transactionList
      .slice(0, limit)
      .sort((a, b) => b.timestamp - a.timestamp);

    return res.status(200).send({
      count: transactions.length,
      transactions,
    });
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
    const height = req.params.height;

    let response = await axios.get(apiURL(`/blocks/${height}`));

    return res.status(200).send(response.data);
  });

  app.get("/wallets/count", async (req, res) => {
    const response = await axios.get(apiURL("/wallets"));
    const wallets = response.data;
    const count = wallets.length;
    return res.status(200).send({
      count,
    });
  });
};

module.exports = appRouter;
