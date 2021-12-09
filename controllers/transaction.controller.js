const TransactionService = require("../services/transaction.service");

const getTransactionInfo = async function (req, res) {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(404)
      .send({ error: "No block height and transaction hash provided" });
  }

  const { height, hash } = req.body;

  try {
    const transaction = await TransactionService.getTransactionInfo(
      height,
      hash
    );
    return res.status(200).send(transaction);
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

const getTransactions = async function (req, res) {
  try {
    const { limit } = req.body;
    const transactions = await TransactionService.getTransactions(limit);

    return res.status(200).send({ count: transactions.length, transactions });
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

module.exports = {
  getTransactionInfo,
  getTransactions,
};
