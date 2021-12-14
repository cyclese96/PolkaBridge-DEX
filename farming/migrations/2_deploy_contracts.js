const BigNumber = require('bignumber.js');

const PolkaBridgeFarm = artifacts.require("PolkaBridgeFarm");
// const lpToken = "0x782F693Da5E54B9B26C379F4f82988632808ED34";
// const PolkaBridge = artifacts.require("PolkaBridge");
const PolkaBridge = "0xf6c9ff0543f932178262df8c81a12a3132129b51";
// const devAddress = "0xfEEF5F353aE5022d0cfcD072165cDA284B65772B";
module.exports = async function(deployer) {
    // await deployer.deploy(PolkaBridge);//, "0xf6c9ff0543f932178262df8c81a12a3132129b51");
    // let pbrDeployed = PolkaBridge.deployed();
    // console.log("PBR deployed at ", PolkaBridge.address);
    await deployer.deploy(PolkaBridgeFarm, PolkaBridge, new BigNumber(500000000000000000), 0);
    console.log("PolkaBridgeFarm deployed at ", PolkaBridgeFarm.address);
};
