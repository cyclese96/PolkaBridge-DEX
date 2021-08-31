import {
  APPROVE_LP_TOKENS,
  APPROVE_TOKEN,
  DEX_ERROR,
  DISAPPROVE_TOKEN,
  GET_PAIR_RESERVES,
  GET_POOL_SHARE,
  HIDE_DEX_LOADING,
  IMPORT_TOKEN,
  LOAD_FROM_TOKEN,
  LOAD_TOKEN_LIST,
  LOAD_TO_TOKEN,
  PRICE_UPDATE,
  RESET_POOL_SHARE,
  SET_LP_BALANCE,
  SET_PAIR_ABI,
  SET_PAIR_DATA,
  SET_POOL_RESERVES,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
  SET_TOKEN_ABI,
  SHOW_DEX_LOADING,
  SWAP_TOKEN_SELECTION,
  UPDATE_SETTINGS,
  VERIFY_SLIPPAGE,
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
  // from_token: {
  //   name: null,
  //   amount: null,
  //   address: null,
  //   price: 3290,
  // },
  // to_token: {
  //   name: null,
  //   amount: null,
  //   address: null,
  //   price: 0.15,
  // },
  swapSettings: {
    swapFee: exchangeFee,
    slippage: defaultSlippage,
    deadline: defaultTransactionDeadline,
  },
  approvedTokens: {}, // { 'PBR':false, 'ETH': true}
  poolShare: "0",
  tokenList: [], // { name, symbol, address, imported, abi }
  importedTokens: {}, // { 'PBR': { abi:[], address:'', symbol:'', name:'', thumbnail:''} }
  lpBalance: {}, // {PBR_ETH:12333, USDT_ETH:22323  }
  lpApproved: {}, // { "PBR_ETH": false, "USDTH_ETH": true }
  poolReserves: {}, // { "PBR": 1223432, "ETH":21, "TOTAL":123232}
  isValidSlippage: false,
  pairContractData: {}, // { "PBR_ETH": { abi: [], address: ""  }  }
  tokenData: {}, // { "PBR": { abi: [], address: ""  }  }
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
    // case LOAD_FROM_TOKEN:
    //   return {
    //     ...state,
    //     from_token: {
    //       ...state.from_token,
    //       name: action.payload.name,
    //       amount: action.payload.amount,
    //       address: action.payload.amount,
    //     },
    //   };
    // case LOAD_TO_TOKEN:
    //   return {
    //     ...state,
    //     from_token: {
    //       ...state.from_token,
    //       name: action.payload.name,
    //       amount: action.payload.amount,
    //       address: action.payload.amount,
    //     },
    //   };
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
    case LOAD_TOKEN_LIST:
      return {
        ...state,
        tokenList: action.payload,
      };
    case IMPORT_TOKEN:
      const _importedData = action.payload.importedData;
      const _listData = action.payload.listData;
      const _index = state.tokenList.findIndex(
        (item) => item.symbol === _listData.symbol
      );
      console.log(_index);
      let _updatedTokenList = [];
      if (_index < 0) {
        _updatedTokenList = [...state.tokenList, _listData];
      } else {
        _updatedTokenList = [...state.tokenList];
      }
      return {
        ...state,
        tokenList: _updatedTokenList,
        importedTokens: {
          ..._importedData,
        },
      };
    case APPROVE_LP_TOKENS:
      const _lpToUpdate = action.payload;
      const lpApprovalState = {};
      lpApprovalState[`${_lpToUpdate.pair}`] = _lpToUpdate.status;
      return {
        ...state,
        lpApproved: {
          ...state.lpApproved,
          ...lpApprovalState,
        },
      };
    case SET_LP_BALANCE:
      const _lpData = action.payload;
      const balanceObj = {};
      balanceObj[`${_lpData.pair}`] = _lpData.amount;
      return {
        ...state,
        lpBalance: {
          ...state.lpBalance,
          ...balanceObj,
        },
      };
    case SET_POOL_RESERVES:
      return {
        ...state,
        poolReserves: action.payload,
      };
    case SHOW_DEX_LOADING:
      return {
        ...state,
        dexLoading: true,
        isValidSlippage: false,
      };
    case HIDE_DEX_LOADING:
      return {
        ...state,
        dexLoading: false,
      };
    case VERIFY_SLIPPAGE:
      return {
        ...state,
        isValidSlippage: action.payload,
      };
    case PRICE_UPDATE:
      return {
        ...state,
        poolReserves: action.payload,
      };
    case SET_TOKEN_ABI:
      return {
        ...state,
        tokenData: {
          ...state.tokenData,
          ...action.payload,
        },
      };
    case SET_PAIR_DATA:
      return {
        ...state,
        pairContractData: {
          ...state.pairContractData,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
