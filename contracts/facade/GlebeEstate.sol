// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";

contract GlebeEstate is ERC1155, ERC1155Pausable, Ownable {


    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public totalSupplyByTokenId;
    mapping(uint256 => string) public tokenIdToUri; // Token ID to URI mapping
    mapping(uint256 => uint256) public tokenPrice; // Token ID to price mapping
      mapping(uint256 => uint256) public totalDividends;
    mapping(address => uint256) public addressToDividends;

    event Listed(address indexed owner, uint256 tokenId, uint256 amount, uint256 price);
    event Transfer(address indexed from, address indexed to, uint256 tokenId, uint256 amount);
     event DividendsDistributed(uint256 tokenId, uint256 amount);
    event DividendsWithdrawn(address indexed recipient, uint256 amount);

   constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setURI(string memory _uri) external onlyOwner {
        _setURI(_uri);
    }

    function ListAsset(address _owner, uint256 _amount, uint256 _price, string memory _uri) external onlyOwner {
        require(_owner != address(0), "Invalid owner address");
        require(_amount > 0, "Invalid token amount");

        uint256 tokenId = nextTokenId++;
        totalSupplyByTokenId[tokenId] = _amount;
        tokenIdToUri[tokenId] = _uri;
        tokenPrice[tokenId] = _price;

        _mint(_owner, tokenId, _amount, "");
        emit Listed(_owner, tokenId, _amount, _price);
    }

    function transfer(address _from, address _to, uint256 _tokenId, uint256 _amount) external payable {
        require(msg.sender == _from || isApprovedForAll(_from, msg.sender), "Caller is not approved");
        require(balanceOf(_from, _tokenId) >= _amount, "Insufficient balance");
        require(msg.value >= tokenPrice[_tokenId] * _amount, "Insufficient payment");

        // Transfer tokens
        _safeTransferFrom(_from, _to, _tokenId, _amount, "");

        // Transfer ETH to the token owner
        payable(owner()).transfer(msg.value);

        emit Transfer(_from, _to, _tokenId, _amount);
    }

    function uri(uint256 _tokenId) public view override returns (string memory) {
        return tokenIdToUri[_tokenId];
    }

 function distributeDividends(uint256 _tokenId, uint256 _amount) external onlyOwner {
        require(totalSupplyByTokenId[_tokenId] > 0, "Token not found");
        require(_amount > 0, "Invalid dividend amount");

        totalDividends[_tokenId] += _amount;
        emit DividendsDistributed(_tokenId, _amount);
    }

    function withdrawDividends() external {
        uint256 dividends = addressToDividends[msg.sender];
        require(dividends > 0, "No dividends to withdraw");

        addressToDividends[msg.sender] = 0;
        payable(msg.sender).transfer(dividends);

        emit DividendsWithdrawn(msg.sender, dividends);
    }
    receive() external payable {
    }

     function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable)
    {
        super._update(from, to, ids, values);
    }
}
