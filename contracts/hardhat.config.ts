import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify"; // For contract verification

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "shanghai", // Required for Etherlink compatibility
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    etherlink: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: ["00cb6da6fc501a02286a665c3cdf23cd428399498fbc7489c558da6ab7a21cc4"], // Use .env for security
      chainId: 128123,
      gas: 30_000_000,
      gasPrice: 2_000_000_000,
    },
  },
  etherscan: {
    apiKey: {
      etherlink: "DUMMY",
    },
    customChains: [
      {
        network: "etherlink",
        chainId: 128123,
        urls: {
          apiURL: "https://testnet.explorer.etherlink.com/api",
          browserURL: "https://testnet.explorer.etherlink.com",
        },
      },
    ],
  },
};

export default config;
