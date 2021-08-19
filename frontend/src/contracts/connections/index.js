import Web3 from "web3";
import Bite from "../abi/Bite.json";
import PolkaBridge from "../abi/PolkaBridge.json";
import PBR_ETH_pairBscAbi from "../abi/PairBscPBR_ETH.json";
import PBR_ETH_pairAbi from "../abi/PairPBR_ETH.json";
import PolkaBridgeMemeToken from "../abi/PolkaBridgeMemeToken.json";
import pwarCoin from "../abi/Pwar.json";
import RouterAbi from "../abi/Router.json";
import FactoryAbi from "../abi/Factory.json";

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
  pbrEthPairAddressBscMainnet,
  pbrEthPairAddressBscTestnet,
  pbrEthPairAddressMainnet,
  pbrEthPairAddressTestnet,
  pwarAddressMainnet,
  pwarAddressTestnet,
  PWAR_BNB,
  routerAddressBscTestnet,
  routerAddressBscMainnet,
  routerAddressTestnet,
  routerAddressMainnet,
  facotryAddressBscTestnet,
  factoryAddresBscMainnet,
  facotryAddressTestnet,
  factoryAddresMainnet,
} from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";

export const biteContract = (network) => {
  const address =
    currentConnection === "testnet" ? biteAddressKoven : biteAddressMainnet;

  const abi = Bite;

  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pbrContract = (network) => {
  const address =
    currentConnection === "testnet" ? pbrAddressTestnet : pbrAddressMainnet;

  const abi = PolkaBridge;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const corgibCoinContract = (network) => {
  const address =
    currentConnection === "testnet"
      ? corgibMemeCoinTestent
      : corgibMemeCoinMainnet;

  const abi = PolkaBridgeMemeToken;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pwarCoinContract = (network) => {
  const address =
    currentConnection === "testnet" ? pwarAddressTestnet : pwarAddressMainnet;

  const abi = pwarCoin;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pairContract = (network) => {
  if (network === bscNetwork) {
    const address =
      currentConnection === "testnet"
        ? pbrEthPairAddressBscTestnet
        : pbrEthPairAddressBscMainnet;

    const abi = PBR_ETH_pairBscAbi;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? pbrEthPairAddressTestnet
        : pbrEthPairAddressMainnet;

    const abi = PBR_ETH_pairAbi;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  }
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
          ? `https://kovan.infura.io/v3/6f0ba6da417340e6b1511be0f2bc389b`
          : `https://mainnet.infura.io/v3/6f0ba6da417340e6b1511be0f2bc389b`;

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
