require('dotenv').config()
const PrivateKeyProvider = require("truffle-privatekey-provider");
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
   contracts_build_directory: "./src/artifacts",
   networks: {
      mumbai: {
         provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, process.env.MUMBAI_INFURA_URL),
         network_id: 80001,
         confirmations: 2,
         timeoutBlocks: 200,
         skipDryRun: true,
         gas: 6000000,
         gasPrice: 10000000000,
       },
      goerli: {
         networkCheckTimeout:60000,
         provider: () => new PrivateKeyProvider(process.env.PRIVATE_KEY, process.env.GOERLI_INFURA_URL),
         network_id: 5,          // Goerli's id
         confirmations: 2,       // # of confirmations to wait between deployments. (default: 0)
         timeoutBlocks: 200,     // # of blocks before a deployment times out  (minimum/default: 50)
         skipDryRun: true        // Skip dry run before migrations? (default: false for public nets )
      },
   },
   contracts_directory: './contracts/',
   contracts_build_directory: './src/artifacts/',
   mocha: {
   },
   compilers: {
      solc: {
         version: "0.8.10",      // Fetch exact version from solc-bin (default: truffle's version)
         docker: false,          // Use "0.5.1" you've installed locally with docker (default: false)
         settings: {             // See the solidity docs for advice about optimization and evmVersion
            optimizer: {
               enabled: true,
               runs: 200
            },
            //evmVersion: "byzantium"
            evmVersion: "istanbul"
         }
      }
   },
   plugins: [
      'truffle-plugin-verify'
   ],
   api_keys: {
      etherscan: process.env.ETHERSCAN_API_KEY,
      polygonscan: process.env.POLYGONSCAN_API_KEY
   }
};