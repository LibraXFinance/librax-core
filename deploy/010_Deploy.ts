// npx hardhat deploy --network astar --tags Deploy
// npx hardhat deploy --network fantom --tags Deploy
// npx hardhat deploy --network avalanche --tags Deploy

import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import LibraDeployConfig from './config'
import UniswapV2FactoryAbi from './abi/UniswapV2Factory.json'
import UniswapV2RouterAbi from './abi/UniswapV2Router.json'
import ERC20Abi from './abi/erc20.json'

import fs from 'fs'
// import { Libra } from '../../addresses/avalanche/Libra'
// import { LShare } from '../../addresses/avalanche/LShare'

export async function mydeploy(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  from: string,
  args: any,
  log: boolean,
  gasLimit: number
) {
  console.log('mydeploy: ' + contractName + '\n')
  await ethers.getContractFactory(contractName)
  const ret = await hre.deployments.deploy(contractName, {
    from: from,
    args: args,
    log: log,
    gasLimit: gasLimit,
  })
  return await ethers.getContractAt(ret.abi, ret.address)
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log('\n\n\n\n\n\n\n start .... deployment \n\n\n\n\n ')
  console.log('hre.network.name = ' + hre.network.name)

  const signers = await ethers.getSigners()

  const deployer = signers[0].address
  const gasLimit = 5000000
  const WastarAddress = LibraDeployConfig.WASTR
  const WFTMAddress = LibraDeployConfig.WFTM
  const WAVAXAddress = LibraDeployConfig.WAVAX
  // const DaiAddress = LibraDeployConfig.DAI
  // const UsdcAddress = LibraDeployConfig.USDC
  let WrawppedToken = LibraDeployConfig.WFTM
  if (hre.network.name == 'avalanche') {
    WrawppedToken = LibraDeployConfig.WAVAX
  }
  console.log('WrawppedToken: ' + WrawppedToken)

  console.log('deployer = ' + deployer)

  const UniswapV2Factory = await mydeploy(hre, 'UniswapV2Factory', deployer, [deployer], true, gasLimit)
  console.log('#UniswapV2Factory')
  console.log(
    'npx hardhat verify --network ' +
      hre.network.name +
      ' ' +
      UniswapV2Factory.address +
      ' ' +
      deployer +
      ' ' +
      ' ' +
      ' --contract ' +
      'contracts/UniswapV2Factory.sol' +
      ':' +
      'UniswapV2Factory' +
      ' '
  )

  const UniswapV2Router02 = await mydeploy(
    hre,
    'UniswapV2Router02',
    deployer,
    [UniswapV2Factory.address, WrawppedToken],
    true,
    gasLimit
  )
  console.log('#UniswapV2Router02')
  console.log(
    'npx hardhat verify --network ' +
      hre.network.name +
      ' ' +
      UniswapV2Router02.address +
      ' ' +
      UniswapV2Factory.address +
      ' ' +
      WrawppedToken +
      ' ' +
      ' ' +
      ' --contract ' +
      'contracts/UniswapV2Router02.sol' +
      ':' +
      'UniswapV2Router02' +
      ' '
  )
}

func.tags = ['Deploy']

func.skip = async (hre) => {
  return (
    hre.network.name !== 'hardhat' &&
    hre.network.name !== 'avalanche' &&
    hre.network.name !== 'astar' &&
    hre.network.name !== 'shiden' &&
    hre.network.name !== 'fantomtest' &&
    hre.network.name !== 'localhost' &&
    hre.network.name !== 'mumbai' &&
    hre.network.name !== 'fantom' &&
    hre.network.name !== 'harmony' &&
    hre.network.name !== 'harmonytest' &&
    hre.network.name !== 'shibuya'
  )
}
export default func
