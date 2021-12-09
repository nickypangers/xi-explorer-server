const { default: axios } = require("axios");
const constants = require("../config/constants");

const getLatestBlock = async () => {
  try {
    const response = await axios.get(constants.apiURL("/blocks/latest"));
    let block = response.data;
    return block;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getBlocks = async () => {
  try {
    const response = await axios.get(constants.apiURL("/blocks"));
    let blocks = response.data;
    blocks.forEach((block) => {
      block.transactions.forEach((transaction) => {
        transaction.block = block.height;
      });
    });
    return blocks;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getBlockInfo = async (height) => {
  if (!height) {
    throw new Error("Block height is required");
  }
  try {
    const response = await axios.get(constants.apiURL(`/blocks/${height}`));
    let block = response.data;
    return block;
  } catch (e) {
    throw new Error(e.message);
  }
};



module.exports = {
  getLatestBlock,
  getBlocks,
  getBlockInfo,
};
