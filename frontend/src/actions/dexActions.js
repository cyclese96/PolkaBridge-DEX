import { WETH_ADDRESS } from "../constants";
import { pairContract } from "../contracts/connections";
import { toWei, getTokenContract } from "../utils/helper";
import { DEX_ERROR, SET_TOKEN0_PRICE, SET_TOKEN1_PRICE } from "./types";

//token0: { amount: "", address: "", symbol:"PBR" }
//token1 { amount: "", address: "", symbol: "ETH" }
export const swapTokens =
  (token0, token1, network, account) => async (dispatch) => {
    try {
      const _pairContract = pairContract(network);

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
      const now = new Date();
      now.setMinutes(now.getMinutes() + deadline); // timestamp
      const _deadlineUnix = Math.floor(now / 1000);

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
