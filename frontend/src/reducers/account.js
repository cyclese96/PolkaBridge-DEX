import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACCOUNT,
  LOAD_FROM_TOKEN,
  LOAD_TO_TOKEN,
  SWAP_TOKEN_SELECTION,
  CHANGE_NETWORK,
  LOAD_CURRENT_BALANCE
} from "../actions/types";
import { etheriumNetwork } from "../constants";

const initalState = {
  connected: false,
  currentAccount: "",
  balance: null,
  from_token: {
    name: null,
    amount:null,
    address:null
  },
  to_token: {
    name: null,
    amount:null,
    address:null
  },
  error: null,
  loading: {
    from: false,
    to: false
  },
  currentNetwork: etheriumNetwork
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
    case LOAD_CURRENT_BALANCE:
      return {
        ...state,
        balance: action.payload
      }
    case LOAD_FROM_TOKEN:
      return {
        ...state,
        from_token: {
          ...state.from_token,
          name: action.payload.name,
          amount: action.payload.amount,
          address: action.payload.amount
        }
      };
    case LOAD_TO_TOKEN:
      return {
        ...state,
        from_token: {
          ...state.from_token,
          name: action.payload.name,
          amount: action.payload.amount,
          address: action.payload.amount
        }
      };
    case SWAP_TOKEN_SELECTION:
      const temp = state.from_token;
      return {
        ...state,
        from_token: state.to_token,
        to_token: temp 
      };
    case SHOW_LOADING:
      if (action.payload === 'from') {
        return {
          ...state,
          loading:{
            ...state.loading,
            from:true
          }
        }
      } else {
        return {
          ...state,
          loading: {
            ...state.loading,
            to: true
          }
        }
      }  
    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.payload
      }
    case HIDE_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          from: false,
          to: false,
        }
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
