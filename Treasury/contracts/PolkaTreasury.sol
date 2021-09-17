pragma solidity 0.8.6;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
// import './IERC20.sol';
// import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PolkaTreasury is Ownable{
    mapping(address => bool) erc_token_list;
    address[] token_array;
    address public _receiver;
    constructor() public Ownable(){
        _receiver = msg.sender;
    }
    receive() external payable {}
    function add_new_token(address token_addr) public returns(bool) {
        require(!erc_token_list[token_addr], 'PolkaTreasury: ERC20 token is already registered');
        erc_token_list[token_addr] = true;
        token_array.push(token_addr);
        return true;
    }
    function is_token_exist(address token_addr) public view returns(bool) {
        if(erc_token_list[token_addr]) {
            return true;
        } else {
            return false;
        }
    }
    function get_token_balance(address token_addr) public view returns(uint) {
        return IERC20(token_addr).balanceOf(address(this));
    }
    function set_receiver(address new_receiver) public onlyOwner returns(bool) {
        require(new_receiver != address(0), 'PolkaTreasury: New Receiver address can not be zero');
        _receiver = new_receiver;
        return true;
    }
    function fee_transfer(address token_addr, uint amount) public onlyOwner {
        require(erc_token_list[token_addr], 'PolkaTreasury: The token is not registered in this wallet');
        uint _balance = get_token_balance(token_addr);
        require(amount <= _balance, 'PolkaTreasury: Balance is less than requirement');
        IERC20(token_addr).approve(address(this), amount);
        IERC20(token_addr).transfer(_receiver, amount);
    }
    function withdrawAll() public onlyOwner {
        uint balance_temp;
        address addr_temp;
        for( uint i ; i < token_array.length ; i++ ) {
            balance_temp = get_token_balance(token_array[i]);
            addr_temp = token_array[i];
            fee_transfer(addr_temp, balance_temp);
        }
    }
}