/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
// import '@nomiclabs/hardhat-etherscan'
import '@librax/hardhat-etherscan'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import '@tenderly/hardhat-tenderly'

import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-watcher'

import 'hardhat-deploy'

import { HardhatUserConfig } from 'hardhat/config'

const privateKey: string = process.env.PRIVATE_KEY || ''
const ftmScanToken: string = process.env.FTMSCAN_TOKEN || ''
const ETHERSCAN_TOKEN: string = process.env.ETHERSCAN_TOKEN || ''
const polygonScanToken: string = process.env.POLYGONSCAN_TOKEN || ''

const mnemonic: string = process.env.MNEMONIC || 'test test test test test test test test test test test test'

let accounts
const localaccount = { mnemonic }
if (privateKey != '') {
  accounts = [privateKey]
} else {
  accounts = { mnemonic }
}
const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  // abiExporter: {
  //   path: "./abi",
  //   clear: false,
  //   flat: true,
  // },
  paths: {
    artifacts: 'artifacts',
    cache: 'cache',
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
    sources: process.env.CONTRACTS_PATH || 'contracts',
    tests: 'test',
  },
  etherscan: {
    // apiKey: polygonScanToken, // polygonscan
    // apiKey: ftmScanToken, // ftmscan
    // apiKey: ETHERSCAN_TOKEN, // ETHERSCAN_TOKEN
    apiKey: {
      astar: 'your API key',
      avalanche: 'your API key',
      opera: ftmScanToken,
    },
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
    enabled: process.env.REPORT_GAS === 'true',
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    carol: {
      default: 3,
    },
  },

  watcher: {
    build: {
      tasks: ['compile'],
      files: ['./contracts/**/*'],
    },

    test: {
      tasks: [
        {
          command: 'test',
          params: {
            //""
            network: 'hardhat',
          },
        },
      ],
      files: ['./test/**/*'],
      verbose: true,
    },
  },

  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local'],
    },
    hardhat: {
      chainId: 1,
      forking: {
        enabled: process.env.FORKING === 'true',
        url: process.env.ETHEREUM_RPC_URL || `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: (process.env.FORKING === 'true' && parseInt(process.env.FORKING_BLOCK!)) || undefined,
      },
      initialBaseFeePerGas: 0,
      live: false,
      saveDeployments: false,
      tags: ['test', 'local'],
    },
    mainnet: {
      url: process.env.ETHEREUM_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 1,
      saveDeployments: true,
      live: true,
      tags: ['prod'],
    },
    avalanche: {
      chainId: 43114,
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts,
      live: true,
      saveDeployments: true,
      tags: ['prod'],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
    },
    moonbase: {
      url: 'https://rpc.testnet.moonbeam.network',
      accounts,
      chainId: 1287,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
    },
    boba: {
      url: 'https://mainnet.boba.network/',
      accounts,
      chainId: 288,
      live: true,
      saveDeployments: true,
      tags: ['prod'],
    },
    moonriver: {
      url: 'https://rpc.moonriver.moonbeam.network',
      accounts,
      chainId: 1285,
      live: true,
      saveDeployments: true,
      tags: ['prod'],
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts,
      chainId: 42161,
      live: true,
      saveDeployments: true,
      blockGasLimit: 700000,
      tags: ['prod'],
    },
    fantom: {
      url: 'https://rpc.ftm.tools/',
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
      tags: ['prod'],

      // gasPrice: 600000000000, // 600Gwei
      // gas: 12000000,
      // timeout: 1800000,
      // gasPrice: 42000000000,
    },
    fantom_testnet: {
      url: 'https://rpc.testnet.fantom.network',
      accounts,
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
    },
    polygon: {
      url: 'https://rpc-mainnet.maticvigil.com',
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    xdai: {
      url: 'https://rpc.xdaichain.com',
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    bsc_testnet: {
      url: 'https://data-seed-prebsc-2-s3.binance.org:8545',
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc', 
      accounts,
      chainId: 43114,
      gasPrice: 'auto',
      live: true,
      gasMultiplier: 2,
      saveDeployments: true,
    },
    astar: {
      // url: 'https://rpc.astar.network:8545',
      // url: 'https://astar.blastapi.io/85ffc636-3e78-4cd9-8e81-81ad0c211ba1', // ags finance
      url: 'https://evm.astar.network', // arthswap
      accounts,
      chainId: 592,
      gasPrice: 'auto',

      // gasPrice: 600000000000, // 600Gwei

      // gas: 12000000,
      // timeout: 1800000,
      // gasPrice: 42000000000,
      // https://blockscout.com/astar
      live: true,
      gasMultiplier: 2,
      saveDeployments: true,
      // tags: ["staging"],
      // gasMultiplier: 2,
    },
    shiden: {
      url: 'https://rpc.shiden.astar.network:8545',
      accounts, // SDN
      chainId: 336,
      // https://blockscout.com/shiden
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      gas: 12000000,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    harmony: {
      url: 'https://api.harmony.one',
      accounts, // ONE
      chainId: 1666600000,
      // https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet
      // https://explorer.harmony.one/
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      gas: 12000000,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    harmonytest: {
      url: 'https://api.s0.b.hmny.io',
      accounts, // ONE
      chainId: 1666700000,
      // https://explorer.pops.one/
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      gas: 12000000,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    auroratest: {
      // https://doc.aurora.dev/getting-started/network-endpoints/
      // https://explorer.mainnet.aurora.dev/
      // https://doc.aurora.dev/interact/metamask/
      url: 'https://testnet.aurora.dev/',
      accounts, // ETH
      chainId: 1313161555, // ( 0x4e454153 )
      //https://explorer.mainnet.aurora.dev/
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      gas: 12000000,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    aurora: {
      // https://doc.aurora.dev/getting-started/network-endpoints/
      // https://explorer.mainnet.aurora.dev/
      // https://doc.aurora.dev/interact/metamask/
      url: 'https://mainnet.aurora.dev',
      accounts, // ETH
      chainId: 1313161554, // (0x4e454152)
      //https://explorer.mainnet.aurora.dev/
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      gas: 12000000,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    shibuya: {
      url: 'https://rpc.shibuya.astar.network:8545',
      // Shibuya Testnet
      accounts, // SBY
      chainId: 81,
      // https://blockscout.com/shibuya
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      gas: 12000000,

      timeout: 1800000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },

    fantomtest: {
      url: 'https://rpc.testnet.fantom.network/',
      // https://testnet.ftmscan.com/
      accounts,
      chainId: 4002,
      live: true,
      // saveDeployments: true,
      tags: ['staging'],
      // gasMultiplier: 2,
      //gas: 12000000,
      //timeout: 1800000,
      ///gasPrice: 42000000000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },

    matic: {
      url: 'https://rpc-mainnet.maticvigil.com',
      // accountsMATIC,
      accounts,
      chainId: 137,
      live: true,
      gasPrice: 600000000000, // 600Gwei

      gasMultiplier: 2,
      saveDeployments: true,
    },
    mumbai: {
      url: 'https://matic-testnet-archive-rpc.bwarelabs.com',
      accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gas: 12000000,
      timeout: 1800000,
      gasPrice: 42000000000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
  },
  mocha: {
    timeout: 40000,
    bail: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || 'project',
    username: process.env.TENDERLY_USERNAME || '',
  },
  solidity: {
    compilers: [
      {
        version: '0.4.23',
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
      {
        version: '0.5.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
      {
        version: '0.5.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],

    overrides: {
      'contracts/UniswapV2Router02.sol': {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
      'contracts/UniswapV2Factory.sol': {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
    },
  },
}

export default config
