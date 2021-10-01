const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const Erc20 = artifacts.require("test/ERC20")
const Weth = artifacts.require("test/WETH9")
// const Factory = artifacts.require("@uniswap/v2-core/UniswapV2Factory")

module.exports = async function (deployer) {

    //testnet
    // let owner = "0x57866ed63ca5f9744cef9aa270bd1f1dce935831";
    let owner = "0xfEEF5F353aE5022d0cfcD072165cDA284B65772B";
    // let factorycontract = "0xAeDC38f770483C0AC7390CAf4edEAdA4F893AC45";
    let factorycontract = "0xdAD1Cee9369B75789dCb269Ba2C36058e3066b49";
    let WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    let treasuey = "0x8419E67fEE7e27F2E13a9399Ae477d7b644495f5";
    //mainnet
    //let treasuey = "0xAa9b97cf7E4c52D028b854F2610aac18F60c86F5";

    await deployer.deploy(UniswapV2Router02, factorycontract, WETH, treasuey);
    let routerInstance = await UniswapV2Router02.deployed();

    console.log("Router Deployed at:", routerInstance.address);

    // try {
    //     await routerInstance.addLiquidity(
    //         "0xf6c9FF0543f932178262DF8C81A12A3132129b51",
    //         "0x117e41ec3ec246873D69BFA5659B8eB209e687d8",
    //         "100000000000000000000",
    //         "10000000000000000000",
    //         0,
    //         0,
    //         "0xfEEF5F353aE5022d0cfcD072165cDA284B65772B",
    //         2632505712
    //     );
    // }
    // catch {
    //     console.log("addLiquidity() Failed");
    // }
};
