const UniswapV2Pair = artifacts.require("UniswapV2Pair");

module.exports = function (deployer) {
  deployer.deploy(UniswapV2Pair);
};
