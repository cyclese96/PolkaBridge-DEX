import {

    SHOW_LOADING,
    HIDE_LOADING,
    LOAD_FROM_TOKEN,
    LOAD_TOKEN_BALANCE,
} from "./types";
import {
    getCurrentAccount,
    getNetworkBalance,
} from "../utils/helper";
import {
    tokenContract,
} from "../contracts/connections";
import { BNB, ETH, etheriumNetwork } from "../constants";



export const approveLpTokenToFarm = () => (dispatch) => {
    try {
        //todo
    } catch (error) {
        console.log('approveLpToken', error)
    }
};

export const stakeLpTokens = () => (dispatch) => {
    try {
        //todo
    } catch (error) {
        console.log('stakeLpTokens', error)
    }
};

export const unstakeLpTokens = () => (dispatch) => {
    try {
        //todo
    } catch (error) {
        console.log('unstakeLpTokens', error)
    }
};

export const harvestReward = () => (dispatch) => {
    try {
        //todo
    } catch (error) {
        console.log('harvestReward', error)
    }
};