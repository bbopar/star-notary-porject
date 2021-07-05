const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "788dac73ba99431aaeadec414dbfbd93";
// //
// // const fs = require('fs');
const mnemonic = "village suggest hundred rough snap ecology pear mirror audit bullet awake faith";

module.exports = {

    networks: {
      development: {
        host: "127.0.0.1",     // Localhost (default: none)
        port: 9545,            // Standard Ethereum port (default: none)
        network_id: "*",       // Any network (default: none)
       },
      // Useful for deploying to a public network.
      // NB: It's important to wrap the provider as a function.
      rinkeby: {
          networkCheckTimeout: 10000,
        provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
          network_id: 4,       // rinkeby's id
          gas: 4500000,        // rinkeby has a lower block limit than mainnet
          gasPrice: 10000000000,
          timeoutBlocks: 200
      },
    },
  
    // Set default mocha options here, use special reporters etc.
    mocha: {
      // timeout: 100000
    },
  
    // Configure your compilers
    compilers: {
      solc: {
        version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
        // settings: {          // See the solidity docs for advice about optimization and evmVersion
        //  optimizer: {
        //    enabled: false,
        //    runs: 200
        //  },
        //  evmVersion: "byzantium"
        // }
      }
    }
  }