const { default: axios } = require("axios");
const constants = require("../config/constants");

exports.getCount = async function (req, res) {
  try {
    const response = await axios.get(constants.apiURL("/wallets"));
    const wallets = response.data;
    const count = wallets.length;
    return res.status(200).send({ count });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};

exports.getWallets = async function (req, res) {
  try {
    const response = await axios.get(constants.apiURL("/wallets"));
    const wallets = response.data;

    if (Object.keys(req.body).length === 0) {
      return res.status(200).send({ wallets });
    }
    const { page, limit } = req.body;
    if (!page || page < 0) {
      return res
        .status(404)
        .send({ message: "Page number should be greater than 0" });
    }
    if (!limit || limit <= 0) {
      return res
        .status(404)
        .send({ message: "Limit should be greater than 0" });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    let walletList = wallets.slice(start, end);
    return res.status(200).send({ wallets: walletList });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};

exports.getAddressDetail = async function (req, res) {
  try {
    const address = req.params.address;
    const walletRes = await axios.get(constants.apiURL(`/wallets/${address}`));
    let wallet = walletRes.data;

    let transactionList = [];

    const blocksRes = await axios.get(constants.apiURL(`/blocks`));
    let blocks = blocksRes.data;
    blocks.forEach((block) => {
      let blockTransactionList = block.transactions;
      blockTransactionList.forEach((transaction) => {
        transactionList.block = block.height;
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
    return res.status(404).send({ message: e.message });
  }
};

exports.getCirculatingSupply = async function (req, res) {
  try {
    const response = await axios.get(constants.apiURL("/wallets"));
    const wallets = response.data;
    const supply = wallets
      .map((wallet) => wallet.balance)
      .reduce((a, b) => a + b, 0);
    return res.status(200).send({ supply });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};
