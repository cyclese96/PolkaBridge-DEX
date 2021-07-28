import {
  DEX_ERROR,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
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
    default:
      return state;
  }
}
