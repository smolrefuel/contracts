pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20Permit{
     /// @notice EIP 2612
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract SmolRefuel is Ownable {
    address payable bot;

    constructor(address payable _bot){
        bot = _bot;
    }

    function setBot(address payable _bot) onlyOwner() external {
        bot = _bot;
    }

    function retrieveToken(IERC20Permit token, uint amount, address to) onlyOwner() external {
        token.transfer(to, amount);
    }

    function setApproval(IERC20Permit token, uint amount, address to) onlyOwner() external {
        token.approve(to, amount);
    }

    function sendETH(address payable to, uint amount) internal {
        (bool sent,) = to.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function refuel(
        IERC20Permit token,
        address payable from,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address router,
        bytes calldata data,
        uint approvalAmount,
        uint botTake
    ) external {
        require(msg.sender == bot, "auth");
        token.permit(from, address(this), amount, deadline, v, r, s);
        token.transferFrom(from, address(this), amount);
        if(approvalAmount != 0){
            if(token.allowance(address(this), router) < amount){
                token.approve(router, approvalAmount); // ignoring reset to 0 because tokens that old are unlikely to have permit anyway
            }
        }
        (bool sent,) = router.call(data);
        require(sent, "Failed router call");
        sendETH(bot, botTake);
        sendETH(from, address(this).balance);
    }
}