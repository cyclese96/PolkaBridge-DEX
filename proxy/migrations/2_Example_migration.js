const Example = artifacts.require("Example");
const Dispatcher = artifacts.require("Dispatcher")

module.exports = async function (deployer) {
  await deployer.deploy(Example);
  let example = await Example.deployed()
  await deployer.deploy(Dispatcher, example.address)
};
