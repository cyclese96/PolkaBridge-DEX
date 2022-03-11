import { DISCONNECT_WALLET, ERROR, LOAD_TOKEN_BALANCE } from "./types";
import { getCurrentAccount, getNetworkBalance } from "../utils/helper";
import { tokenContract } from "../contracts/connections";
import { NATIVE_TOKEN } from "constants/index";

export const getAccountBalance = (token, network) => async (dispatch) => {
  try {
    if (!token || !token?.address || !network) {
      return;
    }

    const accountAddress = await getCurrentAccount();
    const _tokenContract = await tokenContract(token.address, network);

    let tokenWei = 0;
    // if (NATIVE_TOKEN.includes(token.symbol)) {
    //   tokenWei = await getNetworkBalance(accountAddress);
    // } else {
    // }
    tokenWei = await _tokenContract.methods.balanceOf(accountAddress).call();

    const balanceObject = {};
    balanceObject[token.symbol] = tokenWei;
    dispatch({
      type: LOAD_TOKEN_BALANCE,
      payload: balanceObject,
    });
  } catch (error) {
    console.log("getAccountBalance", error);
  }
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
