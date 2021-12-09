const { default: axios } = require("axios");
const constants = require("../config/constants");
const BlockService = require("../services/block.service");

const getWallets = async (body = {}) => {
  try {
    const response = await axios.get(constants.apiURL("/wallets"));
    let wallets = response.data;

    if (Object.keys(body).length === 0) {
      return wallets;
    }

    const { page, limit } = body;
    if (!page || page < 0) {
      throw new Error("Page number should be greater than 0");
    }
    if (!limit || limit < 0) {
      throw new Error("Limit number should be greater than 0");
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const walletList = wallets.slice(start, end);
    return walletList;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getAddressDetail = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }
  try {
    const response = await axios.get(constants.apiURL(`/wallets/${address}`));
    let wallet = response.data;

    let blocks = await BlockService.getBlocks();
    let transactionList = [];
    blocks.forEach((block) => {
      transactionList.push(
        ...block.transactions.filter(
          (transaction) =>
            transaction.from === address || transaction.to === address
        )
      );
    });

    wallet.transactionList = transactionList;
    wallet.transactionCount = transactionList.length;
    return wallet;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getCirculatingSupply = async () => {
  try {
    const wallets = await getWallets();
    const supply = wallets
      .map((wallet) => wallet.balance)
      .reduce((a, b) => a + b, 0);
    return supply;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getWallets,
  getAddressDetail,
  getCirculatingSupply,
};
