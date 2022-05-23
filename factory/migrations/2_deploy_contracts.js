const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const Multicall2 = artifacts.require("Multicall2");

module.exports = function (deployer) {
  let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
  //let owner = "0xfEEF5F353aE5022d0cfcD072165cDA284B65772B";
  //let maintreasury = "0x82c5c4fcd9189ee0160343203d52f97d0b7cabb6";

  let maintreasuryBSC = "0x026a2ca75f1af029489eaea073e62e96a550220a";
  //deployer.deploy(UniswapV2Factory, owner, maintreasuryBSC);
  // deployer.deploy(UniswapV2Pair);//, owner, treasury);
  deployer.deploy(Multicall2);

  // console.log("Factory address is ", factoryAddress);
  // console.log("Pair address is ", pairAddress);
};