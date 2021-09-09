require('chai')
    .use(require('chai-as-promised'))
    .should()

const {assert} = require('chai')

const Router = artifacts.require('./Uniswapv2Router02.sol')

contract('Router Contract', (accounts) => {
    let router
    let res

    before(async() => {
        router = await Router.deployed()
    })

    it('swap method', async() => {
        await 
    })
})