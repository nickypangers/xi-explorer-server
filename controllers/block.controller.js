const BlockService = require("../services/block.service");

const getBlockHeight = async function (req, res) {
  try {
    let block = await BlockService.getLatestBlock();
    return res.status(200).send({ height: block.height });
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

const getBlocks = async function (req, res) {
  try {
    let blocks = await BlockService.getBlocks();
    return res.status(200).send({ blocks });
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};

const getBlockInfo = async function (req, res) {
  try {
    const height = req.params.height;
    let block = await BlockService.getBlockInfo(height);

    return res.status(200).send(block);
  } catch (e) {
    return res.status(404).send({ error: e.message });
  }
};


module.exports = {
  getBlockHeight,
  getBlocks,
  getBlockInfo,

};
