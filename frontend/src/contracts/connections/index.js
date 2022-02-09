import Web3 from "web3";
import RouterAbi from "../abi/Router.json";
import FactoryAbi from "../abi/Factory.json";
import pairAbi from "../abi/pair.json";
import tokenAbi from "../abi/erc20.json";
import farmAbi from "../abi/PolkaBridgeFarm.json";

import {
  bscNetwork,
  currentConnection,
  etheriumNetwork,
  routerAddresses,
  factoryAddresses,
  farmAddresses,
} from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";
import config from "../../utils/config";

export const pairContract = (pairAddress, network) => {
  const _pairAbi = pairAbi;
  const _pairAddress = pairAddress;
  const connection = getCurrentConnection(network, _pairAbi, _pairAddress);
  return connection;
};

//get connecttion of imported contract
export const tokenContract = (address, network) => {
  const _address = address;

  const _abi = tokenAbi;
  const connection = getCurrentConnection(network, _abi, _address);
  return connection;
};

export const routerContract = (network) => {
  const _routerAddress = routerAddresses?.[network];
  const abi = RouterAbi;
  const connection = getCurrentConnection(network, abi, _routerAddress);
  return connection;
};

export const factoryContract = (network) => {
  const _factoryAddress = factoryAddresses?.[network];
  const abi = FactoryAbi;
  const connection = getCurrentConnection(network, abi, _factoryAddress);
  return connection;
};

export const farmContract = (network) => {
  const _farmAddress = farmAddresses?.ethereum;
  const abi = farmAbi;
  const connection = getCurrentConnection(network, abi, _farmAddress);
  return connection;
};

const getCurrentConnection = (blockChainNetwork, abi, contractAddress) => {
  let web3;
  if (isMetaMaskInstalled()) {
    web3 = new Web3(window.ethereum);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(config.ankrEthereumRpc));
  }

  return new web3.eth.Contract(abi, contractAddress);
};
