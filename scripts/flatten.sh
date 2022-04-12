#!/bin/sh


npx hardhat flatten ./contracts/UniswapV2Router02.sol > ./contracts_flattened/UniswapV2Router02.sol
npx hardhat flatten ./contracts/UniswapV2Factory.sol > ./contracts_flattened/UniswapV2Factory.sol
# npx hardhat flatten ./contracts/Multicall.sol > ./contracts_flattened/Multicall.sol



