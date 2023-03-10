import {
  APPROVE_LP_TOKENS,
  APPROVE_TOKEN,
  DEX_ERROR,
  GET_POOL_SHARE,
  GET_TOKEN_1_OUT,
  GET_TOKEN_O_IN,
  HIDE_DEX_LOADING,
  IMPORT_TOKEN,
  LOAD_TOKEN_LIST,
  PRICE_UPDATE,
  RESET_POOL_DATA,
  RESET_POOL_SHARE,
  SET_LP_BALANCE,
  SET_PAIR_DATA,
  SET_POOL_RESERVES,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
  SET_TOKEN_ABI,
  SHOW_DEX_LOADING,
  START_PRICE_LOADING,
  START_TRANSACTION,
  STOP_PRICE_LOADING,
  SWAP_TOKEN_SELECTION,
  UPDATE_SETTINGS,
  UPDATE_TRANSACTION_STATUS,
  VERIFY_SLIPPAGE,
} from "../actions/types";
import {
  defaultSlippage,
  defaultTransactionDeadline,
  exchangeFee,
} from "../constants/index";

const initalState = {
  dexError: null,
  dexLoading: false,
  recentSwaps: [],
  token0In: null, // { tokenAmount, selectedPath }
  token1Out: null, // { tokenAmount, selectedPath }
  priceLoading: false,
  swapSettings: {
    swapFee: exchangeFee,
    slippage: defaultSlippage,
    deadline: defaultTransactionDeadline,
  },
  approvedTokens: {}, // { 'PBR':false, 'ETH': true}
  poolShare: "0",
  tokenList: [], // { name, symbol, address, imported, abi }
  importedToken: [], // {name, symbol, address}
  lpBalance: {}, // {PBR_ETH:12333, USDT_ETH:22323  }
  lpApproved: {}, // { "PBR_ETH": false, "USDTH_ETH": true }
  poolReserves: {}, // { "PBR": 1223432, "ETH":21, "TOTAL":123232}
  isValidSlippage: false,
  pairContractData: {}, // { "PBR_ETH": { abi: [], address: ""  }  }
  tokenData: {}, // { "PBR": { abi: [], address: ""  }  }
  transaction: {
    type: null, // swap/ add_liquidity, remove_liquidity
    hash: null,
    status: null, // pending, success, failed
    result: null, // transaction result on success, { token0:{symbol, address, amount  }  , token1: { symbol, address, amount }, priceRatio:token0/token1 }
  }, //
  allTransactions: [],
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
      // const _importedData = action.payload.importedData;
      const _listData = action.payload.listData;
      const _index = state.tokenList.findIndex(
        (item) => item.symbol === _listData.symbol
      );

      let _updatedTokenList = [];
      if (_index < 0) {
        _updatedTokenList = [_listData, ...state.tokenList];
      } else {
        _updatedTokenList = [...state.tokenList];
        // _updatedTokenList[_index] = _listData;
      }
      return {
        ...state,
        tokenList: _updatedTokenList,
        importedToken: _listData,
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
    case RESET_POOL_DATA:
      return {
        ...state,
        poolShare: "0",
        poolReserves: {},
      };
    case START_TRANSACTION:
      return {
        ...state,
        transaction: initalState.transaction,
      };

    case UPDATE_TRANSACTION_STATUS:
      if (action.payload && action.payload.status === "success") {
        //add curr transaction to transaction history
        return {
          ...state,
          transaction: {
            ...state.transaction,
            ...action.payload,
          },
          allTransactions: [
            { ...state.transaction, ...action.payload },
            ...state.allTransactions,
          ],
        };
      }
      return {
        ...state,
        transaction: {
          ...state.transaction,
          ...action.payload,
        },
      };
    case GET_TOKEN_O_IN:
      return {
        ...state,
        token0In: {
          ...state.token0In,
          ...action.payload,
        },
      };
    case GET_TOKEN_1_OUT:
      return {
        ...state,
        token1Out: {
          ...state.token1Out,
          ...action.payload,
        },
      };
    case START_PRICE_LOADING:
      return {
        ...state,
        priceLoading: true,
      };
    case STOP_PRICE_LOADING:
      return {
        ...state,
        priceLoading: false,
      };

    default:
      return state;
  }
}
