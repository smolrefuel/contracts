pragma solidity ^0.8.7;

interface GasZip {
    function deposit(uint256 chains, address to) payable external;
}

contract GasZipZip {
    address internal immutable gaszip;

    constructor(address _gaszip){
        gaszip = _gaszip;
    }

    fallback() external payable {
        uint data;
        assembly {
            data := calldataload(0)
        }
        GasZip(gaszip).deposit{ value: msg.value }(data, msg.sender);
    }
}