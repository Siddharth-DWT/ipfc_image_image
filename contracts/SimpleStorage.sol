// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract SimpleStorage {
    uint256 ipfsHash;

    function set(uint256 _x) public {
        ipfsHash = _x;
    }

    function get() public view returns (uint256) {
        return ipfsHash;
    }
}
