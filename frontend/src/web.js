import Web3 from "web3";
import { currentConnection } from "./constants";
import provider from "./provider";

var web3;

if (typeof window.web3 !== "undefined") {
  // Use Mist/MetaMask's provider.
  web3 = new Web3(window.web3.currentProvider);
} else {
  if (provider.connected) {
    web3 = new Web3(provider);
  } else {
    // console.log('using infura provider')
    const infura =
      currentConnection === "testnet"
        ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

    web3 = new Web3(new Web3.providers.HttpProvider(infura));
  }
}
export default web3;
