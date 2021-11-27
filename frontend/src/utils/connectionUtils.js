import {
  bscNetwork,
  currentConnection,
  etheriumNetwork,
  moonriverNetwork,
  nullAddress,
  tokenAddresses,
} from "../constants";

import { factoryContract } from "../contracts/connections";
import config from "./config";

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


export const setupNetwork = async (networkObject) => {
  const provider = window.ethereum
  if (provider) {

    try {
      if (networkObject.chainId === `0x${config.ethChainId.toString(16)}` || networkObject.chainId === `0x${config.ethChainIdRinkeby.toString(16)}`) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkObject.chainId }],
        })
      }
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          networkObject
        ]
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

export const getCurrentNetwork = (networkId) => {

  // return ethereum network by default
  if (!networkId) {
    return null;
  }

  if (
    parseInt(networkId) === config.bscChain ||
    parseInt(networkId) === config.bscChainTestent
  ) {
    return bscNetwork;
  } else if (
    parseInt(networkId) === config.ethChainId ||
    parseInt(networkId) === config.ethChainIdRinkeby
  ) {
    return etheriumNetwork;
  } else if (
    parseInt(networkId) === config.moonriverChain ||
    parseInt(networkId) === config.moonriverChainTestent
  ) {
    return moonriverNetwork;
  } else {
    return etheriumNetwork;
  }
};