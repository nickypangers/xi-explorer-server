const { default: axios } = require("axios");
const constants = require("../config/constants");
const BlockService = require("../services/block.service");

const getTransactionInfo = async (height, hash) => {
  if (!hash) {
    throw new Error("Transaction hash is required");
  }
  if (!height) {
    throw new Error("Block height is required");
  }
  try {
    const response = await axios.get(
      constants.apiURL(`/blocks/${height}/transactions/${hash}`)
    );
    let transaction = response.data;
    transaction.height = height;
    return transaction;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getTransactions = async (limit) => {
  try {
    const blocks = await BlockService.getBlocks();
    let transactions = [];
    blocks.forEach((block) => {
      transactions.push(...block.transactions);
    });

    if (!limit || limit === 0) {
      return transactions;
    }

    return transactions
      .slice(0, limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getTransactionInfo,
  getTransactions,
};
