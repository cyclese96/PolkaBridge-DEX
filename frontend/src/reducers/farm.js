import {
  APPROVE_LP_FARM,
  GET_FARM_POOL,
  GET_LP_BALANCE_FARM,
  HIDE_FARM_LOADING,
  SHOW_FARM_LOADING,
} from "../actions/types";

const initalState = {
  farms: {},
  lpApproved: {},
  lpBalance: {},
  loading: {}, //pairAddress:false
};

export default function (state = initalState, action) {
  switch (action.type) {
    case APPROVE_LP_FARM:
      return {
        ...state,
        lpApproved: {
          ...state.lpApproved,
          ...action.payload,
        },
      };
    case GET_FARM_POOL:
      return {
        ...state,
        farms: {
          ...state.farms,
          ...action.payload,
        },
      };
    case GET_LP_BALANCE_FARM:
      return {
        ...state,
        lpBalance: {
          ...state.lpBalance,
          ...action.payload,
        },
      };
    case SHOW_FARM_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    case HIDE_FARM_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
