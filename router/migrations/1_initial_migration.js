const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const Erc20 = artifacts.require("test/ERC20")
const Weth = artifacts.require("test/WETH9")
// const Factory = artifacts.require("@uniswap/v2-core/UniswapV2Factory")

module.exports = function (deployer) {

  //testnet
  let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
  let factorycontract = "0x24640c0887620F6BE908Dd13FA8e6e3E0798F6FD";
  let WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  let treasuey = "0x8419E67fEE7e27F2E13a9399Ae477d7b644495f5";
  //mainnet
  //let treasuey = "0xAa9b97cf7E4c52D028b854F2610aac18F60c86F5";

  deployer.deploy(UniswapV2Router02, factorycontract, WETH, treasuey);
};
