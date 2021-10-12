import Web3 from "web3";
import RouterAbi from "../abi/Router.json";
import FactoryAbi from "../abi/Factory.json";
import pairAbi from '../abi/pair.json';
import tokenAbi from '../abi/erc20.json';

import {
  biteAddressKoven,
  biteAddressMainnet,
  bscNetwork,
  corgibMemeCoinMainnet,
  corgibMemeCoinTestent,
  currentConnection,
  etheriumNetwork,
  pbrAddressTestnet,
  pbrAddressMainnet,
  pwarAddressMainnet,
  pwarAddressTestnet,

  routerAddressBscTestnet,
  routerAddressBscMainnet,
  routerAddressTestnet,
  routerAddressMainnet,
  facotryAddressBscTestnet,
  factoryAddresBscMainnet,
  facotryAddressTestnet,
  factoryAddresMainnet,
  usdtTestnetAddress,
  usdtMainnetAddress,

} from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";

export const biteContract = (network) => {
  const address =
    currentConnection === "testnet" ? biteAddressKoven : biteAddressMainnet;

  const abi = tokenAbi;

  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pbrContract = (network) => {
  const address =
    currentConnection === "testnet" ? pbrAddressTestnet : pbrAddressMainnet;

  const abi = tokenAbi;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const usdtContract = (network) => {
  const address =
    currentConnection === "testnet" ? usdtTestnetAddress : usdtMainnetAddress;

  const abi = tokenAbi;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const corgibCoinContract = (network) => {
  const address =
    currentConnection === "testnet"
      ? corgibMemeCoinTestent
      : corgibMemeCoinMainnet;

  const abi = tokenAbi;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pwarCoinContract = (network) => {
  const address =
    currentConnection === "testnet" ? pwarAddressTestnet : pwarAddressMainnet;

  const abi = tokenAbi;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pairContract = (pairAddress, network) => {

  const _pairAbi = pairAbi;
  const _pairAddress = pairAddress;
  const connection = getCurrentConnection(network, _pairAbi, _pairAddress);
  return connection;
};

export const pairContract2 = (pairData, network) => {
  const connection = getCurrentConnection(
    network,
    pairData.abi,
    pairData.address
  );
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
        ? routerAddressBscTestnet
        : routerAddressBscMainnet;

    const abi = RouterAbi; // update for bsc
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? routerAddressTestnet
        : routerAddressMainnet;

    const abi = RouterAbi;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  }
};

export const factoryContract = (network) => {
  if (network === bscNetwork) {
    const address =
      currentConnection === "testnet"
        ? facotryAddressBscTestnet
        : factoryAddresBscMainnet;

    const abi = FactoryAbi; // update for bsc
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? facotryAddressTestnet
        : factoryAddresMainnet;

    const abi = FactoryAbi;
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
          ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
          : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

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
