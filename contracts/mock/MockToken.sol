//SPDX-License-Identifier: None
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("a", "b") {}

    function mint(address receiver, uint256 amount) external {
        _mint(receiver, amount);
    }
}
