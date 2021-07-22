import { DEX_ERROR, UPDATE_SETTINGS } from "../actions/types";
import {
  defaultSlippage,
  defaultTransactionDeadline,
  exchangeFee,
} from "../constants";

const initalState = {
  error: null,
  recentSwaps: [],
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
    default:
      return state;
  }
}
