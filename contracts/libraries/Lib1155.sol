// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {LibAppStorage, AppStorage} from "./LibAppStorage.sol";


library Lib1155{
    function mint( address _to,
        uint256 _id,
        uint256 _value) internal {
            AppStorage storage s = LibAppStorage.diamondStorage();
             s._balances[_id][_to] += _value;
        }
    
     function removeFromOwner(
        address _from,
        uint256 _id,
        uint256 _value
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        uint256 bal = s._balances[_id][_from];
        require(_value <= bal, "LibItems: insufficient balance for transfer");
        bal -= _value;

        s._balances[_id][_from] = bal;
    }
}