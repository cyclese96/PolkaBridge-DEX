import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACCOUNT,
  CHANGE_NETWORK,
  LOAD_TOKEN_BALANCE,
} from "../actions/types";
import { etheriumNetwork } from "../constants";

const initalState = {
  connected: false,
  currentAccount: "",
  balance: {
    PBR: null,
    ETH: null,
    BNB: null,
    PWAR: null,
    CORGIB: null,
  },
  error: null,
  loading: false,
  currentNetwork: etheriumNetwork,
};

export default function (state = initalState, action) {
  switch (action.type) {
    case CONNECT_WALLET:
      return {
        ...state,
        connected: true,
        currentAccount: action.payload,
      };
    case DISCONNECT_WALLET:
      return {
        ...state,
        connected: false,
        currentAccount: "",
      };
    case SET_ACCOUNT:
      return {
        ...state,
        currentAccount: action.payload,
      };
    case LOAD_TOKEN_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          ...action.payload,
        },
      };
    case SHOW_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.payload,
        balance: initalState.balance,
      };
    case HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
