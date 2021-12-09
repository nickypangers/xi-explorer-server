const { default: axios } = require("axios");
const constants = require("../config/constants");

exports.getBlockHeight = async function (req, res) {
  try {
    const response = await axios.get(constants.apiURL("/blocks/latest"));
    let block = response.data;
    return res.status(200).send({ height: block.height });
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

exports.getBlocks = async function (req, res) {
  try {
    const response = await axios.get(constants.apiURL("/blocks"));
    let blocks = response.data;
    return res.status(200).send({ blocks });
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

exports.getBlockInfo = async function (req, res) {
  try {
    const height = req.params.height;

    if (!height) {
      return res.status(404).send({ error: "Invalid block height" });
    }

    let response = await axios.get(constants.apiURL(`/blocks/${height}`));
    let block = response.data;
    block.transactions.forEach((transaction) => {
      transaction.block = block.height;
    });

    return res.status(200).send(block);
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

exports.getTransactionInfo = async function (req, res) {
  try {
    if (Object.keys(req.params).length === 0) {
      return res.status(404).send({ error: "Invalid transaction hash" });
    }
    const { height, hash } = req.params;
    const response = await axios.get(
      constants.apiURL(`/blocks/${height}/transactions/${hash}`)
    );
    const transaction = response.data;
    return res.status(200).send(transaction);
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

exports.getTransactions = async function (req, res) {
  try {
    const response = await axios.get(constants.apiURL(`/blocks`));
    const blocks = response.data;
    let transactionList = [];
    blocks.forEach((block) => {
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

    return res.status(200).send({ count: transactions.length, transactions });
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};
