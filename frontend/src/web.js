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
    const infura = currentConnection === 'testnet' ? `https://kovan.infura.io/v3/8bcf728cb2074a07a3f3d8069cf8c855` : `https://mainnet.infura.io/v3/8bcf728cb2074a07a3f3d8069cf8c855`;

    web3 = new Web3(new Web3.providers.HttpProvider(infura));
  }
}
export default web3;
