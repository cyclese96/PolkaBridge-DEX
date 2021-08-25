const UniswapV2Router02 = artifacts.require("UniswapV2Router02");

module.exports = function (deployer) {
  deployer.deploy(UniswapV2Router02, '0xA1853078D1447C0060c71a672E6D13882f61A0a6', '0xc778417E063141139Fce010982780140Aa0cD5Ab');
};
