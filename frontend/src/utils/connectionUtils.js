import {
  BITE,
  biteAddressKoven,
  biteAddressMainnet,
  CORGIB,
  corgibMemeCoinMainnet,
  corgibMemeCoinTestent,
  currentConnection,
  ETH,
  nullAddress,
  PBR,
  pbrAddressMainnet,
  pbrAddressTestnet,
  PWAR,
  pwarAddressMainnet,
  pwarAddressTestnet,
  USDT,
  usdtMainnetAddress,
  usdtTestnetAddress,
  WETH_ADDRESS_MAINNET,
  WETH_ADDRESS_TESTNET,
} from "../constants";

import PBR_ETH_pairAbi from "../contracts/abi/PairPBR_ETH.json";
import USDT_ETH_pairAbi from "../contracts/abi/PairUsdtEth.json";

import PbrAbi from "../contracts/abi/PolkaBridge.json";
import UsdtTestAbi from "../contracts/abi/Usdt.json";
import { factoryContract } from "../contracts/connections";

export const getTokenAddress = (tokenSymbol) => {
  switch (tokenSymbol) {
    case PBR:
      return currentConnection === "testnet"
        ? pbrAddressTestnet
        : pbrAddressMainnet;
    case BITE:
      return currentConnection === "testnet"
        ? biteAddressKoven
        : biteAddressMainnet;
    case CORGIB:
      return currentConnection === "testnet"
        ? corgibMemeCoinTestent
        : corgibMemeCoinMainnet;
    case PWAR:
      return currentConnection === "testnet"
        ? pwarAddressTestnet
        : pwarAddressMainnet;
    case USDT:
      return currentConnection === "testnet"
        ? usdtTestnetAddress
        : usdtMainnetAddress;
    case ETH:
      return currentConnection === "testnet"
        ? WETH_ADDRESS_TESTNET
        : WETH_ADDRESS_MAINNET;
    default:
      return "";
  }
};

export const getTokenAbi = (tokenSymbol) => {
  switch (tokenSymbol) {
    case PBR:
      return PbrAbi;
    case USDT:
      return currentConnection === "testnet" ? UsdtTestAbi : null;
    default:
      return null;
  }
};

export const getPairAddress = async (address0, address1, network) => {
  const factory = factoryContract(network);
  const pairAddress = await factory.methods.getPair(address0, address1).call();

  if (pairAddress === nullAddress) {
    return null;
  }
  return pairAddress;
};

// fetch local abi
export const getPairAbi = (symbol0, symbol1) => {
  const pair = `${symbol0}_${symbol1}`;
  if (pair === "PBR_ETH" || pair === "ETH_PBR") {
    return PBR_ETH_pairAbi;
  } else if (pair === "USDT_ETH" || pair === "ETH_USDT") {
    return USDT_ETH_pairAbi;
  } else {
    return null;
  }
};
