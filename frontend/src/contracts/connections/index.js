import Web3 from "web3";
import Bite from "../abi/Bite.json";
import PolkaBridge from "../abi/PolkaBridge.json";
import PBR_ETH_pairAbi from "../abi/PairPBR_ETH.json";
import PolkaBridgeMemeToken from "../abi/PolkaBridgeMemeToken.json";
import pwarCoin from "../abi/Pwar.json";
import RouterAbi from "../abi/Router.json";
import FactoryAbi from "../abi/Factory.json";
import UsdtAbi from "../abi/Usdt.json";
import PairUsdtEthAbi from "../abi/PairUsdtEth.json";

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
  usdtTestnetAddress,
  usdtMainnetAddress,
  usdtEthPairAddressTestnet,
  usdtEthPairAddressMainnet,
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

export const usdtContract = (network) => {
  const address =
    currentConnection === "testnet" ? usdtTestnetAddress : usdtMainnetAddress;

  const abi = UsdtAbi;
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

// returns [address, abi]
const getPairInfo = (token0Symbol, token1Symbol) => {
  const pairName = `${token0Symbol}_${token1Symbol}`;
  if (pairName === "PBR_ETH" || pairName === "ETH_PBR") {
    const addr =
      currentConnection === "testnet"
        ? pbrEthPairAddressTestnet
        : pbrEthPairAddressMainnet;
    const abi = PBR_ETH_pairAbi;
    return [addr, abi];
  } else if (pairName === "USDT_ETH" || pairName === "ETH_USDT") {
    const addr2 =
      currentConnection === "testnet"
        ? usdtEthPairAddressTestnet
        : usdtEthPairAddressMainnet;
    const abi2 = PairUsdtEthAbi;
    return [addr2, abi2];
  } else {
    return [null, null];
  }
};

export const pairContract = (token0Symbol, token1Symbol, network) => {
  const [address, abi] = getPairInfo(token0Symbol, token1Symbol);
  if (!address || !abi) {
    return null;
  }
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

//get connecttion of imported contract
export const tokenContract = (address, abi, network) => {
  const _address = address;

  const _abi = abi;
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
          ? `https://kovan.infura.io/v3/8bcf728cb2074a07a3f3d8069cf8c855`
          : `https://mainnet.infura.io/v3/8bcf728cb2074a07a3f3d8069cf8c855`;

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
