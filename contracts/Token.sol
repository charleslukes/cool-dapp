//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
    string public name = "Charles Chiakwa Token";
    string public symbol = "CCT";

    uint256 public toltalSupply = 1000000;
    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = toltalSupply;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough token");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
