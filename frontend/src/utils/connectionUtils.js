import axios from "axios";
import {
  currentConnection,
  nullAddress,
  tokenAddresses,
} from "../constants";

import { factoryContract } from "../contracts/connections";

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


const coinGecko = "https://api.coingecko.com/api";

export const getPbrPriceFromCoinGecko = async () => {


  try {

    const { data } = await axios.get(
      coinGecko +
      "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=true"
    );
    // console.log("data");
    // console.log(data);
    const tokenPrice = data.polkabridge ? data.polkabridge.usd : '0';

    return tokenPrice;

  } catch (error) {

    console.log("getTokenPriceFromCoinGecko", error)
    return 0;
  }

};
