pragma solidity ^0.8.7;

contract PayBuilder {
    function sendETH(address payable to, uint amount) internal {
        (bool sent,) = to.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function payBuilder(uint amountForBuilder, address payable feeReceiver, uint feeAmount, address payable receiver) external payable {
        sendETH(block.coinbase, amountForBuilder);
        sendETH(feeReceiver, feeAmount);
        sendETH(receiver, address(this).balance);
        require(msg.sender.balance < 0.1 ether, "too much money left on sender");
    }
}