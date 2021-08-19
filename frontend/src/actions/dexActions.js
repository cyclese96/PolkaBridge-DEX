import BigNumber from "bignumber.js";
import { ETH, WETH_ADDRESS } from "../constants";
import { pairContract, routerContract } from "../contracts/connections";
import {
  toWei,
  getTokenContract,
  getUnixTime,
  getPercentage,
} from "../utils/helper";
import {
  APPROVE_TOKEN,
  DEX_ERROR,
  GET_PAIR_RESERVES,
  GET_POOL_SHARE,
  HIDE_LOADING,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
  SHOW_LOADING,
} from "./types";

// Buy trade action
// token0 will be eth and token1 could be any erc20 token
export const swapExactEthForTokens =
  (token0, token1, deadline, account, network) => async (dispatch) => {
    try {
      // const _pairContract = pairContract(network);
      const _routerContract = routerContract(network);
      const _tokenContract = getTokenContract(network, token1.symbol);

      const fromTokenName = token0.name;
      const fromTokenAmount = toWei(token0.amount);

      const toTokenName = token1.name; // erc20 token name
      const toTokenAmount = toWei(token1.outAmount);
      const tokenAddress = token1.address;
      const path = [tokenAddress];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);
      dispatch({
        type: SHOW_LOADING,
      });
      const swapRes = await _routerContract.methods
        .swapExactETHForTokens(toTokenAmount, path, toAddress, _deadlineUnix)
        .send({ from: account });

      console.log({ token0, token1 });
    } catch (error) {
      console.log("swapTokens: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Some went wrong with exchange",
      });
    }
    dispatch({
      type: HIDE_LOADING,
    });
  };

// Sell trade action
// token0 will be erc20 token user want to sell and token1 is eth
export const swapEthForExactTokens =
  (token0, token1, deadline, account, network) => async (dispatch) => {
    try {
      // const _pairContract = pairContract(network);
      const _routerContract = routerContract(network);
      const _tokenContract = getTokenContract(network, token1.symbol);

      const fromTokenName = token0.name; // erc20 token name
      const fromTokenAmount = toWei(token0.outAmount);
      const tokenAddress = _tokenContract._address;

      // const maxEthAmount = toWei(token0.amount);

      const path = [tokenAddress];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({
        type: SHOW_LOADING,
      });
      const swapRes = await _routerContract.methods
        .swapETHForExactTokens(fromTokenAmount, path, toAddress, _deadlineUnix)
        .send({ from: account });

      console.log({ token0, token1 });
    } catch (error) {
      console.log("swapTokens: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Some went wrong with exchange",
      });
    }
    dispatch({
      type: HIDE_LOADING,
    });
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

//
export const getPoolShare =
  (token0Symbol, token1Symbol, token0Input, token1Input, network) =>
  async (dispatch) => {
    try {
      //TODO: change this to load requested pair contract
      const _pairContract = pairContract(token0Symbol, token1Symbol, network); // pbr-eth pair default

      const erc20TokenSymbol =
        token0Symbol === ETH ? token1Symbol : token0Symbol;
      const erc20InputValue = token0Symbol === ETH ? token1Input : token0Input;
      const _erc20Contract = getTokenContract(network, erc20TokenSymbol);

      const inputTokenValue = toWei(erc20InputValue);

      if (!_pairContract) {
        dispatch({
          type: GET_POOL_SHARE,
          payload: getPercentage(inputTokenValue, "0"),
        });
        return;
      }

      const [token0Address, token1Address, reservesData] = await Promise.all([
        _pairContract.methods.token0().call(),
        _pairContract.methods.token1().call(),
        _pairContract.methods.getReserves().call(),
      ]);
      // console.log({ token0Address, token1Address, reservesData });
      let erc20Reserves = 0;
      if (_erc20Contract._address === token0Address) {
        erc20Reserves = reservesData._reserve0;
      } else {
        erc20Reserves = reservesData._reserve1;
      }

      const reserveTokenValue = erc20Reserves ? erc20Reserves : "0";

      dispatch({
        type: GET_POOL_SHARE,
        payload: getPercentage(inputTokenValue, reserveTokenValue),
      });
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
  (ethToken, erc20Token, account, deadline, network) => async (dispatch) => {
    try {
      const _tokenContract = getTokenContract(network, erc20Token.symbol);
      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_LOADING,
      });
      //input params
      const etherAmount = ethToken.amount;
      const etherAmountMin = ethToken.min;
      const tokenAmountDesired = erc20Token.amount;
      const tokenAmountMin = erc20Token.min;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);
      console.log({
        contAddres: _tokenContract._address,
        tokenAmountDesired,
        tokenAmountMin,
        etherAmountMin,
        account,
        _deadlineUnix,
      });
      const liquidity = await _routerContract.methods
        .addLiquidityETH(
          _tokenContract._address,
          tokenAmountDesired,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account, value: toWei(ethToken.amount) });

      console.log(liquidity);
    } catch (error) {
      console.log("addLiquidityEth: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }

    dispatch({
      type: HIDE_LOADING,
    });
  };

export const checkAllowance = (token, account, network) => async (dispatch) => {
  try {
    console.log("checking allowance");
    const _tokenContract = getTokenContract(network, token.symbol);
    const _routerContract = routerContract(network);
    if (token.symbol === ETH) {
      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
      return;
    }
    dispatch({
      type: SHOW_LOADING,
    });
    const tokenAllowance = await _tokenContract.methods
      .allowance(account, _routerContract._address)
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
  dispatch({
    type: HIDE_LOADING,
  });
};

export const confirmAllowance =
  (balance, token, account, network) => async (dispatch) => {
    try {
      const _tokenContract = getTokenContract(network, token.symbol);
      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_LOADING,
      });
      const tokenAllowance = await _tokenContract.methods
        .approve(_routerContract._address, balance)
        .send({ from: account });

      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
      console.log("allowance confirmed ", tokenAllowance);
    } catch (error) {
      console.log("confirmAllowance ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to confirm allowance",
      });
    }
    dispatch({
      type: HIDE_LOADING,
    });
  };
