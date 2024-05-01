// SPDX-LIcense-Identifier: MIT

pragma solidity ^0.8.2;

import {IERC1155,IERC1155Errors} from "../interfaces/IERC1155.sol";
import {AppStorage, Modifiers} from "../libraries/LibAppStorage.sol";
import {Lib1155} from "../libraries/Lib1155.sol";

contract GlebeFacet is Modifiers, IERC1155 {
    AppStorage s;
    event Listed(address indexed owner, uint256 tokenId, uint256 amount, uint256 price);
    event Transfer(address indexed from, address indexed to, uint256 tokenId, uint256 amount);


    function ListAsset(address _owner, uint256 _amount, uint256 _price, string calldata _uri) external onlyGovernor{
        if(_owner == address(0)){
            revert IERC1155Errors.ERC1155InvalidReceiver(_owner);
        }
       require(amount > 0, "invalid amount");
        uint256 tokenId = s.nextTokenId;
        s.nextTokenId = s.nextTokenId++;
         totalSupplyByTokenId[tokenId] = _amount;
        tokenIdToUri[tokenId] = _uri;
        tokenPrice[tokenId] = _price;

        Lib1155.mint(_owner,
         _tokenId,
         _amount)
    }
}