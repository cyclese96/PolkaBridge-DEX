import Web3 from "web3";
import RouterAbi from "../abi/Router.json";
import FactoryAbi from "../abi/Factory.json";
import pairAbi from "../abi/pair.json";
import tokenAbi from "../abi/erc20.json";
import farmAbi from "../abi/PolkaBridgeFarm.json";

import {
  FARM_ADDRESS,
  FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  nullAddress,
} from "../../constants/index";
import { isMetaMaskInstalled } from "../../utils/helper";
import { RPC_URLS } from "../../connection/infura";

export const pairContract = (pairAddress, chainId) => {
  const _pairAbi = pairAbi;
  const _pairAddress = pairAddress;
  const connection = getCurrentConnection(chainId, _pairAbi, _pairAddress);
  return connection;
};

// get connecttion of imported contract
export const tokenContract = (address, chainId) => {
  const _address = address;

  const _abi = tokenAbi;
  const connection = getCurrentConnection(chainId, _abi, _address);
  return connection;
};

export const routerContract = (chainId) => {
  const _routerAddress = ROUTER_ADDRESS[chainId];
  const abi = RouterAbi;
  const connection = getCurrentConnection(chainId, abi, _routerAddress);
  return connection;
};

export const factoryContract = (chainId) => {
  const _factoryAddress = FACTORY_ADDRESS?.[chainId];
  const abi = FactoryAbi;
  const connection = getCurrentConnection(chainId, abi, _factoryAddress);
  return connection;
};

export const farmContract = (chainId) => {
  const _farmAddress = FARM_ADDRESS?.[chainId];
  const abi = farmAbi;
  const connection = getCurrentConnection(chainId, abi, _farmAddress);
  return connection;
};

const getCurrentConnection = (chainId, abi, contractAddress) => {
  let web3;

  if (isMetaMaskInstalled()) {
    web3 = new Web3(window.ethereum);
  } else {
    console.log("connection test ", { rpc: RPC_URLS?.[chainId] });
    web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS?.[chainId]?.[0]));
  }

  return new web3.eth.Contract(abi, contractAddress);
};

export const getPairAddress = async (address0, address1, chainId) => {
  try {
    const factory = factoryContract(chainId);
    const pairAddress = await factory.methods
      .getPair(address0, address1)
      .call();

    if (pairAddress === nullAddress) {
      return null;
    }
    return pairAddress;
  } catch (error) {
    console.log("getPairAddress", error);
    return null;
  }
};
