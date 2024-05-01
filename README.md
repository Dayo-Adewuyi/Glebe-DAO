# GLEBE 

Glebe is a real estate asset tokenization platform on the Canto blockchain. The contract enables fractional ownership of real estate properties, allowing investors to purchase and trade fractional ownership units (tokens) representing shares of the assets. Additionally, the contract facilitates dividend distribution to token holders based on the performance of the underlying assets.

## Features

- **Fractional Ownership**: Glebe allows real estate assets to be divided into fractional ownership units (tokens), enabling investors to own shares of the assets.
  
- **ERC1155 Compatibility**: The contract is based on the ERC1155 token standard, which supports both fungible and non-fungible tokens within the same contract. This allows for efficient management of fractional ownership units and unique real estate assets.

- **Tokenization**: Glebe provides functionality to tokenize real estate assets by creating ERC1155 tokens representing fractional ownership units. Each token is associated with a specific real estate asset and can be traded on the Canto blockchain.

- **Dividend Distribution**: The contract enables the distribution of dividends to token holders based on the performance of the underlying real estate assets. Dividends are distributed proportionally to the number of tokens held by each investor.

- **CANTO Collection**: Users can purchase fractional ownership units by transferring NOTE to the contract along with the token transfer. The asset manager receives the NOTE, effectively raising funds from the sale of shares.

- **DAO Governance**: Glebe is governed by a decentralized autonomous organization (DAO), allowing token holders to collectively make decisions regarding the management and operation of the contract.

## Contract Functions

- `tokenizeRealEstate`: Tokenizes a real estate asset by creating ERC1155 tokens representing fractional ownership units. Each token is associated with a specific real estate asset and has a price in NOTE.

- `transfer`: Allows token holders to transfer fractional ownership units to other addresses. Users must pay the specified token price in NOTE when transferring tokens.

- `distributeDividends`: Enables the contract owner to distribute dividends to token holders based on the performance of the underlying real estate assets.

- `withdrawDividends`: Allows token holders to withdraw their accumulated dividends in NOTE.



