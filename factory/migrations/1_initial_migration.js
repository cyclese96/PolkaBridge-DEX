const UniswapV2Factory = artifacts.require("UniswapV2Factory");

module.exports = function (deployer) {
  deployer.deploy(UniswapV2Factory, '0x453B8D46D3D41d3B3DdC09B20AE53aa1B6aB186E');
};
