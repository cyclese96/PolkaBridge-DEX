import { AUTHENTICATION_STATE } from "../connection/connectionConstants";
import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACCOUNT,
  CHANGE_NETWORK,
  LOAD_TOKEN_BALANCE,
  UPDATE_AUTH_STATE,
  SET_USER_CHAIN,
} from "../actions/types";
import { etheriumNetwork } from "../constants/index";

const initalState = {
  connected: false,
  currentAccount: "",
  currentChain: null,
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
  authenticationState: AUTHENTICATION_STATE.NOT_STARTED,
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
        currentNetwork: action.payload.network,
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
    case UPDATE_AUTH_STATE:
      return {
        ...state,
        authenticationState: action.payload,
      };
    case SET_USER_CHAIN:
      return {
        ...state,
        currentChain: action.payload,
      };
    default:
      return state;
  }
}
