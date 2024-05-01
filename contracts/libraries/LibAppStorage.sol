//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

struct AppStorage {
    address governor;
    uint256 nextTokenId;
    bool contractPaused;
    mapping(uint256 => uint256) totalSupplyByTokenId;
    mapping(uint256 => string) tokenIdToUri;
    mapping(uint256 => uint256) tokenPrice;
    mapping(uint256 => mapping(address => uint256)) _balances;
       mapping(address => mapping(address => bool)) _operatorApprovals;
    mapping(uint256 => uint256) _totalSupply;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }
}

contract Modifiers {
    AppStorage internal s;

    modifier onlyGovernor() {
        
        require(msg.sender == s.governor, "LibAppStorage: No access");
        _;
    }

    modifier whenNotPaused() {
        require(!s.contractPaused, "LibAppStorage: Contract paused");
        _;
    }
}
