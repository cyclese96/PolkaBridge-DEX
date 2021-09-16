pragma solidity 0.8.6;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SpaceToken is ERC20 {
    uint total_supply = 10000000000000000000000;
    constructor() public ERC20("Space Token", "SPACE") {
        _mint(msg.sender, total_supply);
    }
}