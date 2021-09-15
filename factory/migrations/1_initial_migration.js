const UniswapV2Factory = artifacts.require("UniswapV2Factory");

module.exports = function (deployer) {
  let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
  deployer.deploy(UniswapV2Factory, owner);
};
