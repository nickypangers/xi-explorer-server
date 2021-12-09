const { default: axios } = require("axios");
const constants = require("../config/constants");
const WalletService = require("../services/wallet.service");

const getCount = async function (req, res) {
  try {
    const wallets = await WalletService.getWallets();
    const count = wallets.length;
    return res.status(200).send({ count });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};

const getWallets = async function (req, res) {
  try {
    const wallets = await WalletService.getWallets(req.body);
    return res.status(200).send({ wallets });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};

const getAddressDetail = async function (req, res) {
  try {
    let wallet = await WalletService.getAddressDetail(req.body.address);
    return res.status(200).send(wallet);
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};

const getCirculatingSupply = async function (req, res) {
  try {
    let supply = await WalletService.getCirculatingSupply();
    return res.status(200).send({ supply });
  } catch (e) {
    return res.status(404).send({ message: e.message });
  }
};

module.exports = {
  getCount,
  getWallets,
  getAddressDetail,
  getCirculatingSupply,
};
