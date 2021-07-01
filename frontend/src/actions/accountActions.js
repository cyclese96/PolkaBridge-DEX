
import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  LOAD_FROM_TOKEN,
} from "./types";
import { getCurrentAccount } from "../utils/helper";
// import { pbrContract, biteContract, corgibCoinContract, pwarCoinContract } from '../contracts/connections'
import { etheriumNetwork } from "../constants";

//GET user authenticated
export const connectWallet =
  (connect = false, network) =>
    async (dispatch) => {
      try {
        const accountAddress = await getCurrentAccount();
        console.log("connect wallet", accountAddress);
        if (
          localStorage.getItem(`logout${accountAddress}`) == accountAddress &&
          !connect
        ) {
          dispatch({
            type: DISCONNECT_WALLET,
          });
          return;
        } else if (
          localStorage.getItem(`logout${accountAddress}`) == accountAddress &&
          connect
        ) {
          localStorage.removeItem(`logout${accountAddress}`);
          console.log("removing logged out user");
        }

        if (!accountAddress) {
          dispatch({
            type: DISCONNECT_WALLET,
          });
          return;
        }
        dispatch({
          type: CONNECT_WALLET,
          payload: accountAddress,
        });
        dispatch({
          type: SHOW_LOADING,
          payload: 'BITE'
        });

        if (network === etheriumNetwork) {
          console.log('connectWallet: fetching from', network)
          // const [pbrWei, biteWei] = await Promise.all([
          //   pbrContract(network).methods.balanceOf(accountAddress).call(),
          //   biteContract(network).methods.balanceOf(accountAddress).call()
          // ])
          dispatch({
            type: LOAD_FROM_TOKEN,
            payload: { name: 'ETH', amount:0, address:"" },
          });
        } else {
          // const [corgibWei, pwarWei ] = await Promise.all([
          //   corgibCoinContract(network).methods.balanceOf(accountAddress).call(),
          //   pwarCoinContract(network).methods.balanceOf(accountAddress).call()
          // ]) 

          dispatch({
            type: LOAD_FROM_TOKEN,
            payload: { name: 'BNB', amount:0, address:"" },
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
