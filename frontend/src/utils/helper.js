import BigNumber from "bignumber.js";
import {
  BITE,
  biteAddressKoven,
  biteAddressMainnet,
  BNB,
  CORGIB,
  corgibMemeCoinMainnet,
  corgibMemeCoinTestent,
  currentConnection,
  ETH,
  PBR,
  pbrAddressMainnet,
  pbrAddressTestnet,
  PWAR,
  pwarAddressMainnet,
  pwarAddressTestnet,
  USDT,
  usdtMainnetAddress,
  usdtTestnetAddress,
  WETH_ADDRESS_MAINNET,
} from "../constants";
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

export const getPercentageAmount = (value, percent) => {
  const _value = new BigNumber(value.toString());
  const _percent = new BigNumber(percent.toString());
  if (_value.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }
  if (_percent.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }

  const percentValue = _value.multipliedBy(_percent).div(100);
  return percentValue.toString();
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

export const getPriceRatio = (token1, token2) => {
  const _token1 = new BigNumber(token1);
  const _token2 = new BigNumber(token2);
  if (_token1.eq("0") || _token2.eq("0")) {
    return new BigNumber("0").toFixed(4).toString();
  }
  try {
    const _ratio = _token1.div(_token2);
    if (_ratio.gt(1)) {
      return _ratio.toFixed(2).toString();
    }
    return _ratio.toFixed(5).toString();
  } catch (error) {
    console.log("exeption in getPriceRatio", error);
    return "0";
  }
};

export const getTokenOut = (tokenIn, token1Reserve, token2Reserve) => {
  const _token1 = new BigNumber(token1Reserve ? token1Reserve : "0");
  const _token2 = new BigNumber(token2Reserve ? token2Reserve : "0");

  if (_token1.eq("0") || _token2.eq("0")) {
    return new BigNumber("0").toFixed(4).toString();
  }

  try {
    const _out = _token1.div(_token2).multipliedBy(tokenIn);
    if (_out.gt(1)) {
      return _out.toFixed(2).toString();
    }
    return _out.toFixed(5).toString();
  } catch (error) {
    console.log("exeption getTokenOut", error);
    return "0";
  }
};

export const getPercentAmountWithFloor = (amount, percent) => {
  const _amount = new BigNumber(amount ? amount.toString() : 0);
  const _percent = percent ? percent.toString() : 0;

  return _amount
    .multipliedBy(_percent)
    .div(100)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();
};

export const buyPriceImpact = (yTokenamount, yTokenReserves) => {
  const _yAmount = new BigNumber(yTokenamount);

  try {
    const buyImpact = _yAmount.multipliedBy(0.98).div(yTokenReserves);
    console.log("buy impact ", buyImpact.toString());
    return buyImpact.toString();
  } catch (error) {
    console.log("exeption buyPriceImpact", error);
    return "0";
  }
};

export const sellPriceImpact = (xTokenAmount, yTokenAmount, xReserve) => {
  const u = new BigNumber(yTokenAmount);

  const x = new BigNumber(xTokenAmount);
  const y = new BigNumber(yTokenAmount);

  try {
    const er = x.minus(x.multipliedBy(y).div(y.plus(u.multipliedBy(0.98))));

    const sellImpact = er.multipliedBy(0.98).div(xReserve);

    console.log("sell price impact ", sellImpact.toString());
    return sellImpact.toString();
  } catch (error) {
    console.log("exeption at sellPriceImpact", error);
    return "0";
  }
};

export const formatFloat = (floatValue) => {
  const _f = new BigNumber(floatValue);
  return _f.toFixed(4).toString();
};
