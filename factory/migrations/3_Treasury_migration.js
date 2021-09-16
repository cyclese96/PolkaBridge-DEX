const Tend = artifacts.require("test/Tend")
const Spac = artifacts.require("test/Spac")

const Treasury = artifacts.require("PolkaTreasury")

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Tend)
    deployer.deploy(Spac)
    deployer.deploy(Treasury, accounts[0])
}