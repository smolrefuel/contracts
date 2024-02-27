pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SmolRefuel is Ownable {
    using SafeERC20 for ERC20Permit;
    using SafeERC20 for IERC20;

    address payable public bot;

    error AuthFailed();
    error FailedRouterCall();
    error EthTransferFailed();

    constructor(address payable _bot) {
        bot = _bot;
    }

    function setBot(address payable _bot) external onlyOwner {
        bot = _bot;
    }

    function retrieveToken(IERC20 token, uint256 amount, address to) external onlyOwner {
        token.transfer(to, amount);
    }

    function setApproval(IERC20 token, uint256 amount, address to) external onlyOwner {
        token.safeApprove(to, amount);
    }

    function sendETH(address payable to, uint256 amount) internal {
        (bool sent,) = to.call{value: amount}("");
        if (!sent) revert EthTransferFailed();
    }

    function refuel(
        ERC20Permit token,
        address payable from,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address router,
        bytes calldata data,
        address contractToApprove,
        bool shouldApprove,
        uint256 botTake
    ) external payable {
        if (msg.sender != bot) revert AuthFailed();

        token.permit(from, address(this), amount, deadline, v, r, s);
        token.transferFrom(from, address(this), amount);

        if (shouldApprove) token.safeApprove(contractToApprove, type(uint256).max); // ignoring reset to 0 because tokens that old are unlikely to have permit anyway

        (bool sent,) = router.call(data);

        if (!sent) revert FailedRouterCall();

        sendETH(bot, botTake);
        sendETH(from, address(this).balance);
    }

    function refuelWithoutPermit(
        IERC20 token,
        address payable from,
        uint256 amount,
        address router,
        bytes calldata data,
        address contractToApprove,
        bool shouldApprove,
        uint256 botTake
    ) external payable {
        if (msg.sender != bot) revert AuthFailed();

        // fetch token from user
        token.transferFrom(from, address(this), amount);

        // @note give infinite approval to the contract
        // added to save gas
        if (shouldApprove) token.safeApprove(contractToApprove, type(uint256).max);

        (bool sent,) = router.call(data);

        if (!sent) revert FailedRouterCall();

        sendETH(bot, botTake);
        sendETH(from, address(this).balance);
    }

    fallback() external payable {} // fallback is cheaper than receive by 26 gas
}
