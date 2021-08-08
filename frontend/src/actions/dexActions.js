import BigNumber from "bignumber.js";
import { WETH_ADDRESS } from "../constants";
import { pairContract } from "../contracts/connections";
import { toWei, getTokenContract, getUnixTime } from "../utils/helper";
import {
  APPROVE_TOKEN,
  APPROVE_TOKEN_SWAP,
  DEX_ERROR,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
} from "./types";

//token0: { amount: "", address: "", symbol:"PBR" }
//token1 { amount: "", address: "", symbol: "ETH" }
export const swapTokens =
  (token0, token1, deadline, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(network);
      const fromTokenName = token0.name;
      const fromTokenAmount = toWei(token0.amount);

      const toTokenName = token1.name;
      const toTokenAmount = toWei(token1.outAmount);
      const tokenAddress = token1.address;
      const path = [tokenAddress];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);

      const swapRes = await _pairContract.methods
        .swapExactEthForTokens(toTokenAmount, path, toAddress, _deadlineUnix)
        .call();

      console.log({ token0, token1 });
    } catch (error) {
      console.log("swapTokens: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Some went wrong with exchange",
      });
    }
  };

export const getTokenPrice = (tokenNumber, network) => async (dispatch) => {
  try {
    const _pairContract = pairContract(network);

    const price =
      tokenNumber === 0
        ? await _pairContract.methods.price0CumulativeLast().call()
        : await _pairContract.methods.price1CumulativeLast().call();

    console.log({ tokenNumber, price });
    dispatch({
      type: tokenNumber === 0 ? SET_TOKEN0_PRICE : SET_TOKEN1_PRICE,
      payload: price,
    });
  } catch (error) {
    console.log("getTokenPrice:  ", error);
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to get token price",
    });
  }
};

//
export const getAmountsOut =
  (tokenAddress, inputTokens, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(network);

      const amountIn = toWei(inputTokens);
      const path = [tokenAddress, WETH_ADDRESS];
      const amounts = await _pairContract.methods
        .getAmountsOut(amountIn, path)
        .call();

      console.log(amounts);
    } catch (error) {
      console.log("getTokenPrice:  ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to get token price",
      });
    }
  };

//token0: { amount: "", address: "", desired:"", min:"" }
//token1 { amount: "", address: "", desired:"", min:"" }
export const addLiquidityEth =
  (ether, token, account, deadline, network) => async (dispatch) => {
    try {
      const _tokenContract = getTokenContract(token.symbol);
      const _pairContract = pairContract(network);

      console.log(_pairContract._address);
      //input params
      const etherAmount = ether.amount;
      const etherAmountMin = ether.min;
      const tokenAmountDesired = token.amount;
      const tokenAmountMin = token.min;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      const liquidity = await _pairContract.methods
        .addLiquidityETH(
          _tokenContract._address,
          tokenAmountDesired,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .call();

      console.log(liquidity);
    } catch (error) {
      console.log("addLiquidity: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }
  };

export const checkAllowance = (token, account, network) => async (dispatch) => {
  try {
    const _tokenContract = getTokenContract(token.symbol);
    const _pairContract = pairContract(network);

    const tokenAllowance = await _tokenContract.methods
      .allowance(account, _pairContract._address)
      .call();

    console.log("allowance ", tokenAllowance);
    if (new BigNumber(tokenAllowance).gt(0)) {
      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
    } else {
      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: false },
      });
    }
  } catch (error) {
    console.log("checkAllowance ", error);
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to check allowance",
    });
  }
};

export const confirmAllowance =
  (balance, token, account, network) => async (dispatch) => {
    try {
      const _tokenContract = getTokenContract(token.symbol);
      const _pairContract = pairContract(network);

      const tokenAllowance = await _tokenContract.methods
        .approve(_pairContract._address, balance)
        .send({ from: account });

      // console.log('allowance confirmed ', res)
    } catch (error) {
      console.log("confirmAllowance ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to confirm allowance",
      });
    }
  };
