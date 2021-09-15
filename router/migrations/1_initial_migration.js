const UniswapV2Router02 = artifacts.require("UniswapV2Router02");

module.exports = function (deployer) {
  let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
  let factorycontract = "";
  let WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  deployer.deploy(UniswapV2Router02, factorycontract, WETH);
};
