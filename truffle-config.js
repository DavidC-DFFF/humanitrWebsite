require('dotenv').config()
const PrivateKeyProvider = require("truffle-privatekey-provider");

module.exports = {
   networks: {
      goerli: {
         provider: () => new PrivateKeyProvider(process.env.PRIVATE_KEY, process.env.GOERLI_INFURA_URL),
         network_id: 5,          // Goerli's id
         confirmations: 2,       // # of confirmations to wait between deployments. (default: 0)
         timeoutBlocks: 200,     // # of blocks before a deployment times out  (minimum/default: 50)
         skipDryRun: true        // Skip dry run before migrations? (default: false for public nets )
      },
   },
   mocha: {
   },
   compilers: {
      solc: {
         version: "0.8.10",      // Fetch exact version from solc-bin (default: truffle's version)
         docker: false,          // Use "0.5.1" you've installed locally with docker (default: false)
         settings: {             // See the solidity docs for advice about optimization and evmVersion
            optimizer: {
               enabled: false,
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
      etherscan: process.env.ETHERSCAN_API_KEY
   }
};