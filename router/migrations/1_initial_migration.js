const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const Erc20 = artifacts.require("test/ERC20")
const Weth = artifacts.require("test/WETH9")
// const Factory = artifacts.require("@uniswap/v2-core/UniswapV2Factory")

<<<<<<< HEAD
module.exports = async function (deployer, network, accounts) {
  console.log(Weth)
  // if(network == 'test') {
  //   await deployer.deploy(Factory, accounts[0])
  //   const factory = await Factory.deployed()

  //   await deployer.deploy(Erc20, '10000000000000000000000000')

  //   await deployer.deploy(Weth)
  //   const weth = await Weth.deployed()

  //   await deployer.deploy(UniswapV2Router02, factory.address, weth.address)
  // } else {
  //   await deployer.deploy(UniswapV2Router02, '0xA1853078D1447C0060c71a672E6D13882f61A0a6', '0xc778417E063141139Fce010982780140Aa0cD5Ab');
  // }
=======
module.exports = function (deployer) {
  let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
  let factorycontract = "";
  let WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  deployer.deploy(UniswapV2Router02, factorycontract, WETH);
>>>>>>> aeb9e6b71ac60925a6069f310982f873cdc070d6
};
