import {
  currentConnection,
  nullAddress,
  tokenAddresses,
} from "../constants";

import { factoryContract } from "../contracts/connections";

export const getTokenAddress = (tokenSymbol) => {
  let address = '';
  const _tokenAddress = Object.keys(tokenAddresses).forEach(_network => {
    if (Object.keys(tokenAddresses[_network]).includes(tokenSymbol)) {
      address = currentConnection === 'testnet' ? tokenAddresses[_network][tokenSymbol].testnet : tokenAddresses[_network][tokenSymbol].mainnet
    }
  })
  return address;
};

export const getPairAddress = async (address0, address1, network) => {


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
