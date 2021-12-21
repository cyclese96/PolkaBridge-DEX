import Web3 from "web3";
import RouterAbi from "../abi/Router.json";
import FactoryAbi from "../abi/Factory.json";
import pairAbi from '../abi/pair.json';
import tokenAbi from '../abi/erc20.json';
import farmAbi from '../abi/PolkaBridgeFarm.json';

import {
  bscNetwork,
  currentConnection,
  etheriumNetwork,
  routerAddresses,
  factoryAddresses,
  farmAddresses,

} from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";



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
  if (network === bscNetwork) {
    const address =
      currentConnection === "testnet"
        ? routerAddresses.bsc.testnet
        : routerAddresses.bsc.mainnet;

    const abi = RouterAbi; // update for bsc
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? routerAddresses.ethereum.testnet
        : routerAddresses.ethereum.mainnet;

    const abi = RouterAbi;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  }
};

export const factoryContract = (network) => {
  if (network === bscNetwork) {
    const address =
      currentConnection === "testnet"
        ? factoryAddresses.bsc.testnet
        : factoryAddresses.bsc.mainnet;

    const abi = FactoryAbi; // update for bsc
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? factoryAddresses.ethereum.testnet
        : factoryAddresses.ethereum.mainnet;

    const abi = FactoryAbi;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  }
};

export const farmContract = (network) => {
  if (network === bscNetwork) {
    const address = '';
    const abi = farmAbi; // update for bsc
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? farmAddresses.ethereum.testnet
        : farmAddresses.ethereum.mainnet;

    const abi = farmAbi;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  }
};

const getCurrentConnection = (blockChainNetwork, abi, contractAddress) => {
  if (blockChainNetwork === etheriumNetwork) {
    if (isMetaMaskInstalled()) {
      const web3 = new Web3(window.ethereum);
      return new web3.eth.Contract(abi, contractAddress);
    } else {
      const infura =
        currentConnection === "testnet"
          ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split('').reverse().join('')}`
          : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split('').reverse().join('')}`;

      const web3 = new Web3(new Web3.providers.HttpProvider(infura));
      return new web3.eth.Contract(abi, contractAddress);
    }
  } else {
    // const web3 = new Web3(new Web3.providers.HttpProvider(bscConfig.network_rpc_testnet));
    // const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(abi, contractAddress);
  }
};
