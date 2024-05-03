/* global ethers task */
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.10", // Specify the Solidity compiler version you're using
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Adjust the number of optimization runs as needed
      },
    },
  },
  defaultNetwork: "canto",
  networks: {
    canto: {
      url: "http://canto-testnet.plexnode.wtf",
      accounts: [
        "726e53db4f0a79dfd63f58b19874896fce3748fcb80874665e0c147369c04a37",
      ],
    },
  },
};
