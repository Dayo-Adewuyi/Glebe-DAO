# GLEBE 

Glebe is a real world asset tokenization platform on the Canto blockchain. The contract enables fractional ownership of real world assets, allowing investors to purchase and trade fractional ownership units (tokens) representing shares of the assets. Additionally, the contract facilitates dividend distribution to token holders based on the performance of the underlying assets.

## Features

- **Fractional Ownership**: Glebe allows real estate assets to be divided into fractional ownership units (tokens), enabling investors to own shares of the assets.
  
- **ERC1155 Compatibility**: The contract is based on the ERC1155 token standard, which supports both fungible and non-fungible tokens within the same contract. This allows for efficient management of fractional ownership units and unique real estate assets.

- **Tokenization**: Glebe provides functionality to tokenize real estate assets by creating ERC1155 tokens representing fractional ownership units. Each token is associated with a specific real estate asset and can be traded on the Canto blockchain.

- **Dividend Distribution**: The contract enables the distribution of dividends to token holders based on the performance of the underlying real estate assets. Dividends are distributed proportionally to the number of tokens held by each investor.

- **CANTO Collection**: Users can purchase fractional ownership units by transferring CANTO to the contract along with the token transfer. The asset manager receives the CANTO, effectively raising funds from the sale of shares.

- **DAO Governance**: Glebe is governed by a decentralized autonomous organization (DAO), allowing token holders to collectively make decisions regarding the management and operation of the contract.

## Contract Functions

- `tokenizeRealEstate`: Tokenizes a real estate asset by creating ERC1155 tokens representing fractional ownership units. Each token is associated with a specific real estate asset and has a price in NOTE.

- `transfer`: Allows token holders to transfer fractional ownership units to other addresses. Users must pay the specified token price in NOTE when transferring tokens.

- `distributeDividends`: Enables the contract owner to distribute dividends to token holders based on the performance of the underlying real estate assets.

- `withdrawDividends`: Allows token holders to withdraw their accumulated dividends in CANTO.

## CONTRACT ADDRESSES

glebeToken deployed: 0x1bEcbe85c08fB2aA31666fB1576636EA7A92E64A
glebeEstate deployed: 0x6072a7aD90Ed660E76e97D090a6269ad9992a314
GlebeGovernor deployed: 0x1BAfcDBe056FA841F5079f76D15a7c7342F41F3E

## WHAT'S NEXT?

- Deploy contracts leveraging on EIP2535 on the CANTO MAINNET
- GO Live by q3


