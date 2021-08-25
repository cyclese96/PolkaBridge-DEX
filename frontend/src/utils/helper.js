import BigNumber from "bignumber.js";
import { BITE, CORGIB, PBR, PWAR, USDT } from "../constants";
import {
  biteContract,
  corgibCoinContract,
  pbrContract,
  pwarCoinContract,
  usdtContract,
} from "../contracts/connections";
import web3 from "../web";
import axios from "axios";

export const fromWei = (tokens) => {
  if (!tokens) {
    return web3.utils.fromWei("0", "ether");
  }
  let amount = web3.utils.fromWei(tokens, "ether");
  return amount;
};

export const toWei = (tokens) => {
  if (!tokens) {
    return web3.utils.toWei("0", "ether");
  }
  return web3.utils.toWei(tokens, "ether");
};

export const getCurrentAccount = async () => {
  let accounts = [];

  try {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    // accounts = await web3.eth.getAccounts();
    // console.log('accounts', accounts)
    const accountAddress = accounts.length > 0 ? accounts[0] : null;
    return accountAddress;
  } catch (error) {
    console.log("getAccounts", error);
    return error;
  }
};

export const getCurrentNetworkId = async () => {
  if (window.ethereum) {
    const id = await window.ethereum.networkVersion;

    if (id) {
      return id;
    } else {
      return await web3.eth.getChainId();
    }
  } else {
    return await web3.eth.getChainId();
  }
};

export const getNetworkBalance = async (accountAddress) => {
  try {
    const bal = web3.eth.getBalance(accountAddress);
    return bal;
  } catch (error) {
    console.log("getAccountBalance", error);
    return null;
  }
};

export const formatCurrency = (
  value,
  usd = false,
  fractionDigits = 1,
  currencyFormat = false
) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
  });

  //for currency format with $symbol
  if (usd) {
    return formatter.format(value ? value : 0);
  }

  if (typeof window.web3 === "undefined") {
    return formatter.format(value ? value : 0).slice(1);
  }
  const netId = window.ethereum.networkVersion;
  if (["97", "56"].includes(netId) && !currencyFormat) {
    // for bsc network only
    return convertToInternationalCurrencySystem(value ? value : 0, formatter);
  }
  return formatter.format(value ? value : 0).slice(1);
};

function convertToInternationalCurrencySystem(labelValue, formatter) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e9).toFixed(2))
        .slice(1) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e6).toFixed(2))
        .slice(1) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e3).toFixed(2))
        .slice(1) + "K"
    : formatter.format(Math.abs(Number(labelValue))).slice(1);
}

export const resetCurrencyFormatting = (value) => {
  return value.split(",").join("");
};

export const isNumber = (value) => {
  return !isNaN(parseInt(value));
};

export const isMetaMaskInstalled = () => {
  return typeof window.web3 !== "undefined";
};

export const token2PerToken1 = (token1UsdPrice, token2UsdPrice) => {
  const price = token1UsdPrice / token2UsdPrice;
  return price;
};

export const token1PerToken2 = (token1UsdPrice, token2UsdPrice) => {
  const price = token2UsdPrice / token1UsdPrice;
  return price;
};

// current token contract
export const getTokenContract = (network, tokenType) => {
  switch (tokenType) {
    case PBR:
      return pbrContract(network);
    case BITE:
      return biteContract(network);
    case CORGIB:
      return corgibCoinContract(network);
    case PWAR:
      return pwarCoinContract(network);
    case USDT:
      return usdtContract(network);
    default:
      return pwarCoinContract(network);
  }
};

export const getUnixTime = (timeInMintes) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + timeInMintes); // timestamp
  const _timeUnix = Math.floor(now / 1000);
  return _timeUnix;
};

export const getPercentage = (numerator, denominator) => {
  const _nume = new BigNumber(numerator.toString());
  const _dem = new BigNumber(denominator.toString());
  if (_dem.lte(new BigNumber("0"))) {
    return new BigNumber("100").toString();
  }
  if (_nume.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }
  const percent = _nume.div(_dem.plus(_nume)).multipliedBy("100");
  return percent.toFixed(4).toString();
};

export const fetchTokenAbi = async (address) => {
  try {
    const _api = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API}`;
    // console.log(_api);
    const res = await axios.get(_api);
    return res.data;
  } catch (error) {
    console.log("fetchTokenAbi", error);
    return {};
  }
};

export const fetchTokenInfo = async (address) => {
  try {
    const _api = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API}`;
    const res = await axios.get(_api);
    console.log("api res ", res.data);
    return res.data;
  } catch (error) {
    console.log("fetchTokenInfo", error);
    return {};
  }
};
