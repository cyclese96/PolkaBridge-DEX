pragma solidity =0.5.16;

import '../UniswapV2ERC20.sol';

contract Tend is UniswapV2ERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
