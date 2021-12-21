import BigNumber from "bignumber.js";
import web3 from "../web";
import axios from "axios";
import { ethers } from "ethers";
import { farmingPoolConstants } from "../constants";

const WEI_UNITS = 1000000000000000000;
const WEI_UNITS_6 = 1000000;

export const fromWei = (tokens, decimals = 18) => {
  try {
    if (!tokens) {
      return new BigNumber(0).toString();
    }

    return new BigNumber(tokens).div(new BigNumber(10).exponentiatedBy(decimals)).toString();
  } catch (error) {
    console.log("exeption in fromWei ", error);
    return null;
  }
};

export const toWei = (tokens, decimals = 18) => {
  try {
    if (!tokens) {
      return new BigNumber(0).toString();
    }
    return new BigNumber(tokens).multipliedBy(new BigNumber(10).exponentiatedBy(decimals)).toFixed(0).toString();
  } catch (error) {
    console.log("exeption in toWei , ", error);
    return null;
  }
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
    return null;
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

export const resetCurrencyFormatting = (value) => {
  return value.split(",").join("");
};

export const isNumber = (value) => {
  if (value === ".") {
    return true;
  }
  return !isNaN(parseInt(value));
};

export const isMetaMaskInstalled = () => {
  return typeof window.web3 !== "undefined";
};

export const token2PerToken1 = (token1UsdPrice, token2UsdPrice) => {
  try {
    const price = token1UsdPrice / token2UsdPrice;
    return price;
  } catch (error) {
    console.log("exeption in token2PerToken1", error);
    return "0";
  }
};

export const token1PerToken2 = (token1UsdPrice, token2UsdPrice) => {
  const price = token2UsdPrice / token1UsdPrice;
  return price;
};


export const getUnixTime = (timeInMintes) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + timeInMintes); // timestamp
  const _timeUnix = Math.floor(now / 1000);
  return _timeUnix;
};

export const getPercentage = (yourValue, totalValue) => {
  const _your = new BigNumber(yourValue ? yourValue : 0);
  const _total = new BigNumber(totalValue ? totalValue : 0);
  if (_your.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }
  if (_total.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }
  const percent = _your.div(_total).multipliedBy(100);
  return percent.toFixed(4).toString();
};

export const getPercentageAmount = (value, percent) => {
  const _value = new BigNumber(value ? value : 0);
  const _percent = new BigNumber(percent ? percent : 0);
  if (_value.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }
  if (_percent.lte(new BigNumber("0"))) {
    return new BigNumber("0").toString();
  }

  const percentValue = _value.multipliedBy(_percent).div(100);
  return percentValue.toString();
};


export const fetchTokenInfo = async (address) => {
  try {
    const _api = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split('').reverse().join('')}`;
    const res = await axios.get(_api);
    // console.log("api res ", res.data);
    return res.data;
  } catch (error) {
    console.log("fetchTokenInfo", error);
    return {};
  }
};

export const getPriceRatio = (token1, token2) => {
  const _token1 = new BigNumber(token1 ? token1 : 0);
  const _token2 = new BigNumber(token2 ? token2 : 0);
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

export const getToken2Out = (tokenIn, token1Reserve, token2Reserve) => {
  const r0 = new BigNumber(!token1Reserve ? 0 : token1Reserve);
  const r1 = new BigNumber(!token2Reserve ? 0 : token2Reserve);
  const x = new BigNumber(!tokenIn ? 0 : tokenIn);

  if (r0.lte(0) || r1.lte(0) || x.lte(0)) {
    return new BigNumber(0).toFixed(0).toString();
  }

  try {
    // price out calculation
    const numerator = x.multipliedBy(998).multipliedBy(r1);
    const denominator = r0.multipliedBy(1000).plus(x.multipliedBy(998));
    const y = numerator.div(denominator);

    // let result;
    // let integerPart;
    const result = fromWei(y.toFixed(0).toString());
    // if (y.gt(1)) {
    //   // integerPart = y.toString().split(".");
    //   // result = fromWei(integerPart[0]);
    // } else {
    //   // integerPart = y.toString().split(".");
    //   // result = fromWei(y.toString());
    //   const _toString = y.div(WEI_UNITS).toString();
    //   result = _toString;
    // }

    return result;
  } catch (error) {
    console.log("exeption getTokenOut", { error, tokenIn });
    return new BigNumber(0).toFixed(0).toString();
  }
};

export const getToken1Out = (tokenIn, token1Reserve, token2Reserve) => {
  const r0 = new BigNumber(!token1Reserve ? 0 : token1Reserve);
  const r1 = new BigNumber(!token2Reserve ? 0 : token2Reserve);
  const y = new BigNumber(!tokenIn ? 0 : tokenIn);

  if (r0.lte(0) || r1.lte(0) || y.lte(0)) {
    return new BigNumber(0).toFixed(0).toString();
  }

  try {
    // price out calculation
    const numerator = y.multipliedBy(998).multipliedBy(r0);
    const denominator = r1.multipliedBy(1000).plus(y.multipliedBy(998));
    // const numerator = y.multipliedBy(1000).multipliedBy(r0);
    // const denominator = r1.multipliedBy(998).minus(y.multipliedBy(998));
    const x = numerator.div(denominator);

    const result = fromWei(x.toFixed(0).toString());

    // if (x.gt(1)) {
    //   const _toString = x.div(WEI_UNITS).toString()
    //   result = _toString;
    // } else {
    //   const _toString = x.div(WEI_UNITS).toString();
    //   result = _toString;
    // }

    return result;
  } catch (error) {
    console.log("exeption getTokenOut", { error, tokenIn });
    return new BigNumber(0).toFixed(0).toString();
  }
};

// Token out amount for add liquidity
export const getTokenOutWithReserveRatio = (
  tokenIn,
  token1Reserve,
  token2Reserve
) => {
  const _token1 = new BigNumber(token1Reserve ? token1Reserve : 0);
  const _token2 = new BigNumber(token2Reserve ? token2Reserve : 0);

  if (_token1.eq("0") || _token2.eq("0")) {
    return new BigNumber("0").toFixed(4).toString();
  }

  console.log('getTokenOutWithReserveRatio', { tokenIn, token1Reserve, token2Reserve })

  try {
    const _out = _token1.div(_token2).multipliedBy(tokenIn);

    // if (_out.gt(1)) {
    //   return _out.toFixed(2).toString();
    // }
    return _out.toString();
  } catch (error) {
    console.log("exeption getTokenOut", error);
    return "0";
  }
};

export const getPercentAmountWithFloor = (amount, percent) => {
  const _amount = new BigNumber(amount ? amount : 0);
  const _percent = percent ? percent : 0;

  return _amount
    .multipliedBy(_percent)
    .div(100)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();
};
// not in use
export const buyPriceImpact = (yTokenamount, yTokenReserves) => {
  const _yAmount = new BigNumber(yTokenamount ? yTokenamount : 0);
  const _yTokenReserves = yTokenReserves ? yTokenReserves : 0;

  try {
    const buyImpact = _yAmount.multipliedBy(0.98).div(_yTokenReserves);
    // console.log("buy impact ", buyImpact.toString());
    return buyImpact.toString();
  } catch (error) {
    console.log("exeption buyPriceImpact", error);
    return "0";
  }
};

export const sellPriceImpact = (xTokenAmount, yTokenAmount, xReserve) => {
  const u = new BigNumber(yTokenAmount ? yTokenAmount : 0);

  const x = new BigNumber(xTokenAmount ? xTokenAmount : 0);
  const y = new BigNumber(yTokenAmount ? yTokenAmount : 0);

  try {
    const er = x.minus(x.multipliedBy(y).div(y.plus(u.multipliedBy(0.98))));

    const sellImpact = er.multipliedBy(0.98).div(xReserve);

    // console.log("sell price impact ", sellImpact.toString());
    return sellImpact.toString();
  } catch (error) {
    console.log("exeption at sellPriceImpact", error);
    return "0";
  }
};

export const formatFloat = (floatValue) => {
  const _f = new BigNumber(floatValue ? floatValue : 0);
  return _f.toFixed(4).toString();
};

export const isAddress = (value) => {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
};

export const cacheImportedToken = (tokenData) => {
  let tokens = localStorage.getItem("tokens");
  if (!tokens) {
    localStorage.setItem("tokens", JSON.stringify([tokenData]));
  } else {
    tokens = JSON.parse(tokens);
    // check if token already present in the list then skip caching
    const _index = tokens.findIndex(
      (_item) => _item.address === tokenData.address
    );
    if (_index >= 0) {
      return;
    }

    tokens = [tokenData, ...tokens];
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }
};

export const getCachedTokens = () => {
  let tokens = localStorage.getItem("tokens");
  if (!tokens) {
    return [];
  }
  return JSON.parse(tokens);
};


export const getPbrRewardApr = (pbrPerYear, pbrPriceUSD, poolLiquidityUSD) => {

  try {

    const pbrRewardApr = new BigNumber(pbrPerYear).times(pbrPriceUSD).div(poolLiquidityUSD).times(100);

    return pbrRewardApr.toFixed(0).toString();

  } catch (error) {
    console.log('calculate apr exeption ', error);
    return '0';
  }

}

export const getLpApr = (pool) => {
  const lpApr = farmingPoolConstants.ethereum?.[pool]?.lpApr
  return lpApr ? lpApr : 0;
}