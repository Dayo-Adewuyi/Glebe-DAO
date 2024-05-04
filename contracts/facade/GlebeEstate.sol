// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface Turnstile {
    function register(address) external returns (uint256);
}

contract GlebeEstate is ERC1155, ERC1155Pausable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct TokenHolder {
        address holder;
        uint256 balance;
    }

    struct Listing {
        address owner;
        uint256 amount;
        uint256 price;
        string uri;
        string description;
        string location;
    }

    uint256 public nextTokenId;
    mapping(uint256 => TokenHolder[]) private tokenHolders;
    mapping(uint256 => uint256) public totalSupplyByTokenId;
    mapping(uint256 => string) public tokenIdToUri; // Token ID to URI mapping
    mapping(uint256 => uint256) public tokenPrice; // Token ID to price mapping
    mapping(uint256 => uint256) public totalDividends;
    mapping(address => mapping(uint256 => uint256)) public addressToDividends;
    mapping(uint256 => Listing) public listings;
    event Listed(
        address indexed owner,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    );
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 tokenId,
        uint256 amount
    );
    event DividendsDistributed(uint256 tokenId, uint256 amount);
    event DividendsWithdrawn(address indexed recipient, uint256 amount);

    constructor(address _turnstile) ERC1155("") Ownable() {
        Turnstile(_turnstile).register(tx.origin);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function symbol() public pure returns (string memory) {
        return "GLEB";
    }

    function setURI(string memory _uri) external onlyOwner {
        _setURI(_uri);
    }

    function listAsset(
        address _owner,
        uint256 _amount,
        uint256 _price,
        string calldata _uri,
        string calldata _description,
        string calldata _location
    ) external whenNotPaused onlyOwner returns (uint256) {
        require(_owner != address(0), "Invalid owner address");
        require(_amount > 0, "Invalid token amount");
        nextTokenId++;
        uint256 tokenId = nextTokenId;
        totalSupplyByTokenId[tokenId] = _amount;
        tokenIdToUri[tokenId] = _uri;
        tokenPrice[tokenId] = _price;
        listings[tokenId] = Listing(
            _owner,
            _amount,
            _price,
            _uri,
            _description,
            _location
        );
        _mint(_owner, tokenId, _amount, "");
        tokenHolders[tokenId].push(TokenHolder(_owner, _amount));
        emit Listed(_owner, tokenId, _amount, _price);
        return tokenId;
    }

    function transfer(
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _amount
    ) external payable nonReentrant whenNotPaused {
        require(
            msg.sender == _from || isApprovedForAll(_from, msg.sender),
            "Caller is not approved"
        );
        require(balanceOf(_from, _tokenId) >= _amount, "Insufficient balance");
        require(
            msg.value >= tokenPrice[_tokenId].mul(_amount),
            "Insufficient payment"
        );

        // Transfer tokens
        _safeTransferFrom(_from, _to, _tokenId, _amount, "");

        payable(_from).transfer(msg.value);

        emit Transfer(_from, _to, _tokenId, _amount);
    }

    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return tokenIdToUri[_tokenId];
    }

    function distributeDividends(
        uint256 _tokenId,
        uint256 _totalAmount
    ) external nonReentrant whenNotPaused onlyOwner {
        require(totalSupplyByTokenId[_tokenId] > 0, "Token not found");
        require(_totalAmount > 0, "Invalid total dividend amount");

        // Calculate total balance of the token
        uint256 totalTokenBalance = totalSupplyByTokenId[_tokenId];
        require(totalTokenBalance > 0, "No tokens issued");

        // Calculate dividend per token
        uint256 dividendPerToken = _totalAmount / totalTokenBalance;

        // Distribute dividends proportionally to token holders
        uint256 numHolders = tokenHolders[_tokenId].length;
        for (uint256 i = 0; i < numHolders; i++) {
            address tokenHolder = tokenHolders[_tokenId][i].holder;
            uint256 balance = tokenHolders[_tokenId][i].balance;
            uint256 dividends = balance * dividendPerToken;
            addressToDividends[tokenHolder][_tokenId] += dividends;
        }

        // Update total dividends for the token
        totalDividends[_tokenId] += _totalAmount;

        emit DividendsDistributed(_tokenId, _totalAmount);
    }

    function withdrawDividends(
        uint256 _tokenId
    ) external whenNotPaused nonReentrant {
        uint256 dividends = addressToDividends[msg.sender][_tokenId];
        require(dividends > 0, "No dividends to withdraw");

        addressToDividends[msg.sender][_tokenId] = 0;
        payable(msg.sender).transfer(dividends);

        emit DividendsWithdrawn(msg.sender, dividends);
    }

    function _safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes memory _data
    ) internal override {
        super._safeTransferFrom(_from, _to, _id, _amount, _data);

        // Update token holder balances
        _updateTokenHolderBalance(_id, _from);
        _updateTokenHolderBalance(_id, _to);

        // Distribute dividends upon token transfer
        distributeDividendsUponTransfer(_from, _to, _id, _amount);
    }

    function _updateTokenHolderBalance(
        uint256 _tokenId,
        address _holder
    ) private {
        bool holderFound = false;
        uint256 holderBalance = balanceOf(_holder, _tokenId);
        uint256 numHolders = tokenHolders[_tokenId].length;
        for (uint256 i = 0; i < numHolders; i++) {
            if (tokenHolders[_tokenId][i].holder == _holder) {
                holderFound = true;
                tokenHolders[_tokenId][i].balance = holderBalance;
                break;
            }
        }
        if (!holderFound) {
            tokenHolders[_tokenId].push(TokenHolder(_holder, holderBalance));
        }
    }

    function distributeDividendsUponTransfer(
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _amount
    ) private {
        // Skip dividend distribution if transferring to oneself
        if (_from == _to) return;

        // Calculate and distribute dividends to the sender
        uint256 dividends = calculateDividends(_from, _tokenId, _amount);
        addressToDividends[_from][_tokenId] += dividends;

        // Subtract dividends from the receiver's balance
        addressToDividends[_to][_tokenId] -= dividends;

        emit DividendsDistributed(_tokenId, dividends);
    }

    function calculateDividends(
        address _holder,
        uint256 _tokenId,
        uint256 _amount
    ) private view returns (uint256) {
        // Calculate dividends based on the current balance of the token holder
        uint256 balance = balanceOf(_holder, _tokenId);
        uint256 totalTokenBalance = totalSupplyByTokenId[_tokenId];
        uint256 totalDividendsForToken = totalDividends[_tokenId];

        if (totalTokenBalance == 0 || totalDividendsForToken == 0) {
            return 0;
        }

        uint256 proportionalDividends = _amount.mul(totalDividendsForToken).div(
            totalTokenBalance
        );
        return proportionalDividends.mul(balance).div(_amount);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Pausable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155) {
        super._afterTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
