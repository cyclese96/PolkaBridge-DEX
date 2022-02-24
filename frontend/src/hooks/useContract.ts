import { Contract } from "@ethersproject/contracts";

// import IUniswapV2PairJson from '@uniswap/v2-core/build/IUniswapV2Pair.json'
// import IUniswapV2Router02Json from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
// import QuoterJson from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
// import TickLensJson from '@uniswap/v3-periphery/artifacts/contracts/lens/TickLens.sol/TickLens.json'
// import UniswapInterfaceMulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
// import NonfungiblePositionManagerJson from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
// import V3MigratorJson from '@uniswap/v3-periphery/artifacts/contracts/V3Migrator.sol/V3Migrator.json'
// import ARGENT_WALLET_DETECTOR_ABI from 'abis/argent-wallet-detector.json'
// import EIP_2612 from 'abis/eip_2612.json'
// import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
// import ENS_ABI from 'abis/ens-registrar.json'
// import ERC20_ABI from 'abis/erc20.json'
// import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
// import ERC721_ABI from 'abis/erc721.json'
// import ERC1155_ABI from 'abis/erc1155.json'
// import { ArgentWalletDetector, EnsPublicResolver, EnsRegistrar, Erc20, Erc721, Erc1155, Weth } from 'abis/types'
// import WETH_ABI from 'abis/weth.json'
// import {
//   ARGENT_WALLET_DETECTOR_ADDRESS,
//   ENS_REGISTRAR_ADDRESSES,
//   MULTICALL_ADDRESS,
//   NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
//   QUOTER_ADDRESSES,
//   TICK_LENS_ADDRESSES,
//   V2_ROUTER_ADDRESS,
//   V3_MIGRATOR_ADDRESSES,
// } from 'constants/addresses'
// import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useMemo } from "react";

import { getContract } from "../utils/contractUtils";
import MulticallABI from "../contracts/abi/multicall.json";
import useActiveWeb3React from "./useActiveWeb3React";

const MULTICALL_ADDRESS = {
  1: "",
  4: "0x6c4f9282bBD29992bF4F064F0165e805336Eef59",
};

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        "0x6c4f9282bBD29992bF4F064F0165e805336Eef59",
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

// export function useV2MigratorContract() {
//   return useContract<V3Migrator>(V3_MIGRATOR_ADDRESSES, V2MigratorABI, true)
// }

// export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
//   return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
// }

export function useInterfaceMulticall(): Contract | null {
  const { chainId } = useActiveWeb3React();

  return useContract(MULTICALL_ADDRESS[4], MulticallABI, false);
}

// export function useV3NFTPositionManagerContract(withSignerIfPossible?: boolean): NonfungiblePositionManager | null {
//   return useContract<NonfungiblePositionManager>(
//     NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
//     NFTPositionManagerABI,
//     withSignerIfPossible
//   )
// }

// export function useV3Quoter() {
//   return useContract<Quoter>(QUOTER_ADDRESSES, QuoterABI)
// }

// export function useTickLens(): TickLens | null {
//   const { chainId } = useActiveWeb3React()
//   const address = chainId ? TICK_LENS_ADDRESSES[chainId] : undefined
//   return useContract(address, TickLensABI) as TickLens | null
// }
