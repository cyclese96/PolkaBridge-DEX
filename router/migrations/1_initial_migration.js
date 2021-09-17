const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const Erc20 = artifacts.require("test/ERC20")
const Weth = artifacts.require("test/WETH9")
// const Factory = artifacts.require("@uniswap/v2-core/UniswapV2Factory")

module.exports = function (deployer) {
  let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
  let factorycontract = "0x24640c0887620F6BE908Dd13FA8e6e3E0798F6FD";
  let WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  deployer.deploy(UniswapV2Router02, factorycontract, WETH);
};
