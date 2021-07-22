import { pairContract } from "../contracts/connections";
import { DEX_ERROR } from "./types";

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
        ? await _pairContract.methods.price0CumulativeLast.call()
        : await _pairContract.methods.price1CumulativeLast.call();

    console.log({ tokenNumber, price });
  } catch (error) {
    console.log("getTokenPrice:  ", error);
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to get token price",
    });
  }
};

//token0: { amount: "", address: "", symbol:"PBR" }
//token1 { amount: "", address: "", symbol: "ETH" }
export const addLiquidity =
  (token0, token1, network, account) => async (dispatch) => {
    try {
      const _pairContract = pairContract(network);

      console.log({ token0, token1 });
    } catch (error) {
      console.log("addLiquidity: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }
  };
