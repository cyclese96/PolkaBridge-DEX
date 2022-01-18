import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  LOAD_FROM_TOKEN,
  LOAD_TOKEN_BALANCE,
} from "./types";
import { getCurrentAccount, getNetworkBalance } from "../utils/helper";
import { tokenContract } from "../contracts/connections";
import { BNB, ETH, etheriumNetwork } from "../constants";

//GET user authenticated
export const connectWallet =
  (connect = false, network) =>
  async (dispatch) => {
    try {
      const accountAddress = await getCurrentAccount();
      // console.log("connect wallet", accountAddress);
      if (
        localStorage.getItem(`logout${accountAddress}`) === accountAddress &&
        !connect
      ) {
        dispatch({
          type: DISCONNECT_WALLET,
        });
        return;
      } else if (
        localStorage.getItem(`logout${accountAddress}`) === accountAddress &&
        connect
      ) {
        localStorage.removeItem(`logout${accountAddress}`);
        // console.log("removing logged out user");
      }
      // console.log('connect wallet is here')
      if (!accountAddress) {
        dispatch({
          type: DISCONNECT_WALLET,
        });
        return;
      }

      // console.log('connect wallet is running  ', accountAddress)
      dispatch({
        type: CONNECT_WALLET,
        payload: accountAddress,
      });
      dispatch({
        type: SHOW_LOADING,
      });

      if (network === etheriumNetwork) {
        // console.log("connectWallet: fetching from", network);
        const [ethWei] = await Promise.all([getNetworkBalance(accountAddress)]);

        dispatch({
          type: LOAD_TOKEN_BALANCE,
          payload: { ETH: ethWei },
        });
      } else {
        const [bnbWei] = await Promise.all([getNetworkBalance(accountAddress)]);
        // console.log("curr network bal ", bnbWei);

        dispatch({
          type: LOAD_TOKEN_BALANCE,
          payload: { BNB: bnbWei },
        });
      }
    } catch (error) {
      console.log("connectWallet ", error);
      dispatch({
        type: ERROR,
        payload: "Failed to connect Meta Mask!",
      });
    }

    dispatch({
      type: HIDE_LOADING,
    });
  };

export const getAccountBalance = (token, network) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  try {
    const accountAddress = await getCurrentAccount();
    const _tokenContract = await tokenContract(token.address, network);

    let tokenWei = 0;
    if (token.symbol === ETH || token.symbol === BNB) {
      tokenWei = await getNetworkBalance(accountAddress);
    } else {
      tokenWei = await _tokenContract.methods.balanceOf(accountAddress).call();
    }

    // console.log("curr network bal ", ethWei);
    const balanceObject = {};
    balanceObject[token.symbol] = tokenWei;
    dispatch({
      type: LOAD_TOKEN_BALANCE,
      payload: balanceObject,
    });
  } catch (error) {
    console.log("getAccountBalance", error);
    dispatch({
      type: ERROR,
      payload: "Failed to load balance!",
    });
  }
  dispatch({
    type: HIDE_LOADING,
  });
};

export const logout = () => (dispatch) => {
  try {
    localStorage.setItem("userAddress", "");
    dispatch({
      type: DISCONNECT_WALLET,
    });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Something went wrong!",
    });
  }
};
