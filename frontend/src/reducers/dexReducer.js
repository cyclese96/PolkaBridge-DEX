import {
  DEX_ERROR,
  LOAD_FROM_TOKEN,
  LOAD_TO_TOKEN,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
  SWAP_TOKEN_SELECTION,
  UPDATE_SETTINGS,
} from "../actions/types";
import {
  defaultSlippage,
  defaultTransactionDeadline,
  exchangeFee,
} from "../constants";

const initalState = {
  error: null,
  recentSwaps: [],
  token0Price: null,
  token1Price: null,
  from_token: {
    name: null,
    amount: null,
    address: null,
    price: 1980,
  },
  to_token: {
    name: null,
    amount: null,
    address: null,
    price: 0.048,
  },
  swapSettings: {
    swapFee: exchangeFee,
    slippage: defaultSlippage,
    deadline: defaultTransactionDeadline,
  },
};

export default function (state = initalState, action) {
  switch (action.type) {
    case DEX_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_SETTINGS:
      return {
        ...state,
        swapSettings: {
          ...state.swapSettings,
          ...action.payload,
        },
      };
    case SET_TOKEN0_PRICE:
      return {
        ...state,
        token0Price: action.payload,
      };
    case SET_TOKEN1_PRICE:
      return {
        ...state,
        token1Price: action.payload,
      };
    case LOAD_FROM_TOKEN:
      return {
        ...state,
        from_token: {
          ...state.from_token,
          name: action.payload.name,
          amount: action.payload.amount,
          address: action.payload.amount,
        },
      };
    case LOAD_TO_TOKEN:
      return {
        ...state,
        from_token: {
          ...state.from_token,
          name: action.payload.name,
          amount: action.payload.amount,
          address: action.payload.amount,
        },
      };
    case SWAP_TOKEN_SELECTION:
      const temp = state.from_token;
      return {
        ...state,
        from_token: state.to_token,
        to_token: temp,
      };
    default:
      return state;
  }
}
