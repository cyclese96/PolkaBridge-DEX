const PriceFeed = artifacts.require("PriceFeed");

module.exports = function (deployer) {
  deployer.deploy(PriceFeed);
};
