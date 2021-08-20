import {
  APPROVE_TOKEN,
  DEX_ERROR,
  DISAPPROVE_TOKEN,
  GET_PAIR_RESERVES,
  GET_POOL_SHARE,
  LOAD_FROM_TOKEN,
  LOAD_TO_TOKEN,
  RESET_POOL_SHARE,
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
  dexError: null,
  dexLoading: false,
  recentSwaps: [],
  token0Price: null,
  token1Price: null,
  from_token: {
    name: null,
    amount: null,
    address: null,
    price: 3290,
  },
  to_token: {
    name: null,
    amount: null,
    address: null,
    price: 0.15,
  },
  swapSettings: {
    swapFee: exchangeFee,
    slippage: defaultSlippage,
    deadline: defaultTransactionDeadline,
  },
  approvedTokens: {}, // { 'PBR':false, 'ETH': true}
  pairReserves: {
    address0: "",
    reserve0: "",
    address1: "",
    reserve1: "",
  },
  poolShare: "0",
};

export default function (state = initalState, action) {
  switch (action.type) {
    case DEX_ERROR:
      return {
        ...state,
        dexError: action.payload,
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
    case APPROVE_TOKEN:
      const _tokenToUpdate = action.payload;
      const approvalState = {};
      approvalState[`${_tokenToUpdate.symbol}`] = _tokenToUpdate.status;
      return {
        ...state,
        approvedTokens: {
          ...state.approvedTokens,
          ...approvalState,
        },
      };
    case GET_POOL_SHARE:
      return {
        ...state,
        poolShare: action.payload,
      };
    case RESET_POOL_SHARE:
      return {
        ...state,
        poolShare: "0",
      };
    default:
      return state;
  }
}
