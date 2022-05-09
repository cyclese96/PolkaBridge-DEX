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
} from "../../constants/index";
import { isMetaMaskInstalled } from "../../utils/helper";
import config from "../../utils/config";

export const pairContract = (pairAddress, chainId) => {
  const _pairAbi = pairAbi;
  const _pairAddress = pairAddress;
  const connection = getCurrentConnection(chainId, _pairAbi, _pairAddress);
  return connection;
};

//get connecttion of imported contract
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

  const ankrRpcs = {
    1: config.ankrEthereumRpc,
    56: config.ankrRpcBsc,
  };
  if (isMetaMaskInstalled()) {
    web3 = new Web3(window.ethereum);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(ankrRpcs?.[chainId]));
  }

  return new web3.eth.Contract(abi, contractAddress);
};
