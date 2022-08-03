// npx hardhat deploy --network avalanche --tags Test

import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import LibraDeployConfig from './config'
import UniswapV2FactoryAbi from './abi/UniswapV2Factory.json'
import UniswapV2RouterAbi from './abi/UniswapV2Router.json'
import ERC20Abi from './abi/erc20.json'

import fs from 'fs'
// import { Libra } from '../../addresses/astar/Libra'
// import { LShare } from '../../addresses/astar/LShare'

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

  console.log('deployer = ' + deployer)

  const UniswapV2RouterAddress = LibraDeployConfig.UniswapV2Router
  const UniswapV2FactoryAddress = LibraDeployConfig.UniswapV2Factory
  // const WastarAddress = LibraDeployConfig.WASTR
  // const DaiAddress = LibraDeployConfig.DAI
  // const UsdcAddress = LibraDeployConfig.USDC

  // const WastarAddress = LibraDeployConfig.WASTR
  const WFTMAddress = LibraDeployConfig.WFTM
  const DaiAddress = LibraDeployConfig.DAI
  const UsdcAddress = LibraDeployConfig.USDC
  let WrawppedTokenAddress = LibraDeployConfig.WFTM
  if (hre.network.name == 'avalanche') {
    WrawppedTokenAddress = LibraDeployConfig.WAVAX
  }

  const UniswapV2Router = await ethers.getContractAt(UniswapV2RouterAbi, UniswapV2RouterAddress)
  const UniswapV2Factory = await ethers.getContractAt(UniswapV2FactoryAbi, UniswapV2FactoryAddress)
  console.log('UniswapV2RouterAddress: ' + UniswapV2RouterAddress)
  console.log('UniswapV2FactoryAddress: ' + UniswapV2FactoryAddress)

  const WrawppedToken = await ethers.getContractAt(ERC20Abi, WrawppedTokenAddress)
  const DAI = await ethers.getContractAt(ERC20Abi, DaiAddress)

  let thePair1 = ''
  let thePair2 = ''
  thePair1 = await UniswapV2Factory.getPair(DaiAddress, WrawppedTokenAddress)
  thePair2 = await UniswapV2Factory.getPair(UsdcAddress, WrawppedTokenAddress)
  const thePair1LP = await ethers.getContractAt(ERC20Abi, thePair1)
  const thePair2LP = await ethers.getContractAt(ERC20Abi, thePair2)

  if (thePair1 != '0x0000000000000000000000000000000000000000' && (await thePair1LP.balanceOf(deployer)) > 0) {
    const bal = await thePair1LP.balanceOf(deployer)
    console.log('thePair1LP.bal: ' + bal)
    console.log('UniswapV2Router.removeLiquidity....')
    await (
      await UniswapV2Router.removeLiquidity(
        DaiAddress,
        WrawppedTokenAddress,
        bal.div(3).toString(),
        0,
        0,
        deployer,
        '9999999999999',
        { gasLimit: gasLimit }
      )
    ).wait()
    console.log('UniswapV2Router.removeLiquidity....ok ')
  } else {
    console.log('WrawppedToken.approve....')
    await (await WrawppedToken.approve(UniswapV2RouterAddress, '100000000000000000')).wait()
    console.log('DAI.approve....')
    await (await DAI.approve(UniswapV2RouterAddress, '100000000000000000')).wait()

    console.log('UniswapV2Router.addLiquidity....')

    await (
      await UniswapV2Router.addLiquidity(
        DaiAddress,
        WrawppedTokenAddress,
        '100000000000000000',
        '100000000000000000',
        0,
        0,
        deployer,
        '9999999999999',
        { gasLimit: gasLimit }
      )
    ).wait()
    console.log('UniswapV2Router.addLiquidity....ok ')
  }
}

func.tags = ['Test']

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
