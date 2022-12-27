require("@nomiclabs/hardhat-waffle");
const { ALCHEMY_URL, WALLET_PRIVATE_KEY } = require("./config/env");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: ALCHEMY_URL,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
};
