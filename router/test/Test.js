require('chai')
    .use(require('chai-as-promised'))
    .should()

const {assert} = require('chai')

const Router = artifacts.require('./UniswapV2Router02.sol')
const ERC20 = artifacts.require('./test/ERC20.sol')
const WETH = artifacts.require('./test/WETH9.sol')
contract('Router Contract', (accounts) => {
    let router, erc20, weth
    let res

    before(async() => {
        router = await Router.deployed()
        erc = await ERC20.deployed()
        weth = await WETH.deployed()
    })

    it('swap method', async() => {
        // Token A : ERC-20
        // Token B : WETH
        // Decimal: 1000000000000000000
        await router.addLiquidity(erc.address, weth.address, '10000000000000000000000', '100000000000000000000', 0, 0, accounts[0], 1634173335)
    })
})