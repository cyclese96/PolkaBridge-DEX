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


export const getPairAddress = async (address0, address1, network) => {


  console.log('getting pair', { address0, address1 })
  try {

    const factory = factoryContract(network);
    const pairAddress = await factory.methods.getPair(address0, address1).call();

    if (pairAddress === nullAddress) {
      return null;
    }
    return pairAddress;

  } catch (error) {

    console.log("getPairAddress", error)
    return null;
  }

};
