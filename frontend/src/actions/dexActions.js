import BigNumber from "bignumber.js";
import {
  currentConnection,
  swapFnConstants,
  ROUTER_ADDRESS,
  NATIVE_TOKEN,
} from "../constants/index";
import {
  pairContract,
  routerContract,
  tokenContract,
} from "../contracts/connections";
import {
  toWei,
  getUnixTime,
  getPercentage,
  cacheImportedToken,
  getCachedTokens,
} from "../utils/helper";
import { fetchTokenInfo } from "../utils/helper";
import {
  APPROVE_LP_TOKENS,
  APPROVE_TOKEN,
  DEX_ERROR,
  GET_POOL_SHARE,
  HIDE_DEX_LOADING,
  HIDE_LOADING,
  IMPORT_TOKEN,
  LOAD_TOKEN_LIST,
  SET_LP_BALANCE,
  SET_PAIR_DATA,
  SET_POOL_RESERVES,
  SHOW_DEX_LOADING,
  SHOW_LOADING,
  START_TRANSACTION,
  UPDATE_TRANSACTION_STATUS,
} from "./types";
import ethereumTokens from "../tokenList/tokenListEthereum.json";
import testTokens from "../tokenList/tokenListTest.json";
import tokenListBsc from "../tokenList/tokenListBsc.json";

// swap transaction function
export const swapTokens =
  (token0, token1, deadline, currentSwapFn, currenSwapPath, account, chainId) =>
  async (dispatch) => {
    try {
      const _routerContract = routerContract(chainId);

      const token0In = token0.amount;

      const token1Min = 0; //token1.min;

      const path = currenSwapPath;
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);
      dispatch({
        type: SHOW_DEX_LOADING,
      });
      dispatch({ type: START_TRANSACTION });

      let swapPromise;
      if (currentSwapFn === swapFnConstants.swapExactETHForTokens) {
        //case 1 swapExactETHForTokens
        swapPromise = _routerContract.methods
          .swapExactETHForTokens(token1Min, path, toAddress, _deadlineUnix)
          .send(
            { from: account, value: token0In },
            function (error, transactionHash) {
              if (error) {
                dispatch({
                  type: UPDATE_TRANSACTION_STATUS,
                  payload: { type: "swap", hash: null, status: "failed" },
                });
              } else {
                dispatch({
                  type: UPDATE_TRANSACTION_STATUS,
                  payload: { type: "swap", hash: transactionHash },
                });
              }
            }
          );
      } else if (currentSwapFn === swapFnConstants.swapETHforExactTokens) {
        // case 2 swapETHforExactTokens
        swapPromise = _routerContract.methods
          .swapExactETHForTokens(token1Min, path, toAddress, _deadlineUnix)
          .send(
            { from: account, value: token0In },
            function (error, transactionHash) {
              if (error) {
                dispatch({
                  type: UPDATE_TRANSACTION_STATUS,
                  payload: { type: "swap", hash: null, status: "failed" },
                });
              } else {
                dispatch({
                  type: UPDATE_TRANSACTION_STATUS,
                  payload: { type: "swap", hash: transactionHash },
                });
              }
            }
          );
      } else if (currentSwapFn === swapFnConstants.swapExactTokensForETH) {
        // case 3 swapExactTokensForETH

        swapPromise = _routerContract.methods
          .swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: null, status: "failed" },
              });
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: transactionHash },
              });
            }
          });
      } else if (currentSwapFn === swapFnConstants.swapTokensForExactETH) {
        // case 4  swapTokensForExactETH

        swapPromise = _routerContract.methods
          .swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: null, status: "failed" },
              });
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: transactionHash },
              });
            }
          });
      } else if (currentSwapFn === swapFnConstants.swapExactTokensForTokens) {
        // case 5  swapExactTokensForTokens

        swapPromise = _routerContract.methods
          .swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: null, status: "failed" },
              });
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: transactionHash },
              });
            }
          });
      } else {
        // case 6 swapTokensForExactTokens

        swapPromise = _routerContract.methods
          .swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: null, status: "failed" },
              });
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "swap", hash: transactionHash },
              });
            }
          });
      }

      await swapPromise
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "swap",
              status: "success",
              result: { token0, token1 },
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "swap", status: "failed" },
          });
        });
    } catch (error) {
      console.log("swapTokens: ", error);
    }
    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

//token0 : { name, symbol, amount }, token1: {name, symbol, amount }
export const getPoolShare =
  (pairAddress, tokenA, tokenB, chainId) => async (dispatch) => {
    try {
      //Load pair contract of selected token pair
      const _pairContract = pairContract(pairAddress, chainId);

      const [token0Address, reservesData] = await Promise.all([
        _pairContract.methods.token0().call(),
        _pairContract.methods.getReserves().call(),
      ]);
      let tokenAReserve = "0";

      if (tokenA.address === token0Address) {
        tokenAReserve = reservesData._reserve0;
      } else {
        tokenAReserve = reservesData._reserve1;
      }

      dispatch({
        type: GET_POOL_SHARE,
        payload: getPercentage(tokenA.input, tokenAReserve),
      });
    } catch (error) {
      console.log("getPoolShare:  ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to get token price",
      });
    }
  };

//token0: { amount: "", address: "", desired:"", min:"" }
//token1 { amount: "", address: "", desired:"", min:"" }
export const addLiquidity =
  (token0, token1, account, deadline, chainId) => async (dispatch) => {
    try {
      const _routerContract = routerContract(chainId);

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      //input params
      const token0AmountDesired = token0.amount;
      const token0AmountMin = "0";
      const token1AmountDesired = token1.amount;
      const token1AmountMin = "0";

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({ type: START_TRANSACTION });
      await _routerContract.methods
        .addLiquidity(
          token0.address,
          token1.address,
          token0AmountDesired,
          token1AmountDesired,
          token0AmountMin,
          token1AmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "add", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "add", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "add",
              status: "success",
              result: { token0, token1 },
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "add", status: "failed" },
          });
        });
    } catch (error) {
      console.log("addLiquidity: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }

    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

// token0: { amount: "", address: "", desired:"", min:"" }
// token1 { amount: "", address: "", desired:"", min:"" }
export const addLiquidityEth =
  (ethToken, erc20Token, account, deadline, chainId) => async (dispatch) => {
    try {
      const _routerContract = routerContract(chainId);
      dispatch({
        type: SHOW_DEX_LOADING,
      });
      //input params
      const etherAmount = ethToken.amount;
      const etherAmountMin = "0";
      const tokenAmountDesired = erc20Token.amount;
      const tokenAmountMin = "0";
      const tokenAddress = erc20Token.address;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({ type: START_TRANSACTION });
      await _routerContract.methods
        .addLiquidityETH(
          tokenAddress,
          tokenAmountDesired,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send(
          { from: account, value: toWei(etherAmount) },
          function (error, transactionHash) {
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "add", hash: null, status: "failed" },
              });
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: "add", hash: transactionHash },
              });
            }
          }
        )
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "add",
              status: "success",
              result: { token0: ethToken, token1: erc20Token },
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "add", status: "failed" },
          });
        });
    } catch (error) {
      console.log("addLiquidityEth: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }

    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

//token0: { amount: "", address: "", desired:"", min:"" }
//token1 { amount: "", address: "", desired:"", min:"" }
export const removeLiquidity =
  (token0, token1, account, lpAmount, deadline, chainId) =>
  async (dispatch) => {
    try {
      const _routerContract = routerContract(chainId);

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      //input params

      const token0AmountMin = "0";
      const token1AmountMin = "0";

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({ type: START_TRANSACTION });
      await _routerContract.methods
        .removeLiquidity(
          token0.address,
          token1.address,
          lpAmount,
          token0AmountMin,
          token1AmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "remove", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "remove", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "remove",
              status: "success",
              result: { token0, token1, lpAmount },
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "remove", status: "failed" },
          });
        });
    } catch (error) {
      console.log("removeLiquidity: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to remove liquidity",
      });
    }

    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

//token0: { amount: "", address: "", desired:"", min:"" }
//token1 { amount: "", address: "", desired:"", min:"" }
export const removeLiquidityEth =
  (ethToken, erc20Token, account, lpAmount, deadline, chainId) =>
  async (dispatch) => {
    try {
      const _routerContract = routerContract(chainId);

      dispatch({
        type: SHOW_DEX_LOADING,
      });

      const erc20Address = erc20Token.address;
      const etherAmountMin = "0";
      const tokenAmountMin = "0";
      const lpTokenAmount = lpAmount;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({ type: START_TRANSACTION });
      await _routerContract.methods
        .removeLiquidityETH(
          erc20Address,
          lpTokenAmount,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "remove", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "remove", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "remove",
              status: "success",
              result: {
                token0: ethToken,
                token1: erc20Token,
                lpToken: lpTokenAmount,
              },
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "remove", status: "failed" },
          });
        });
    } catch (error) {
      console.log("removeLiquidityEth: ", error);
    }

    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

// token: { symbol, name, address, abi }
export const checkAllowance = (token, account, chainId) => async (dispatch) => {
  try {
    const _tokenContract = tokenContract(token.address, chainId);

    const _routerContract = routerContract(chainId);
    if (token.symbol === NATIVE_TOKEN?.[chainId]) {
      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
      return;
    }
    dispatch({
      type: SHOW_LOADING,
    });
    const tokenAllowance = await _tokenContract.methods
      .allowance(account, _routerContract._address)
      .call();

    if (new BigNumber(tokenAllowance).gt(0)) {
      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
    } else {
      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: false },
      });
    }
  } catch (error) {
    console.log("checkAllowance ", error);
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to check allowance",
    });
  }
  dispatch({
    type: HIDE_LOADING,
  });
};

export const confirmAllowance =
  (balance, token, account, chainId) => async (dispatch) => {
    try {
      const _tokenContract = tokenContract(token.address, chainId);

      const _routerAddress = ROUTER_ADDRESS?.[chainId];

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      await _tokenContract.methods
        .approve(_routerAddress, balance)
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "token_approve", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "token_approve", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "token_approve",
              status: "success",
              result: {}, // add result data for reciept
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "token_approve", status: "failed" },
          });
        });

      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
    } catch (error) {
      console.log("confirmAllowance ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to confirm allowance",
      });
    }
    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

export const checkLpAllowance =
  (token0, token1, pairAddress, account, chainId) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, chainId);
      const _routerAddress = ROUTER_ADDRESS?.[chainId];

      dispatch({
        type: SHOW_DEX_LOADING,
      });

      const lpAllowance = await _pairContract.methods
        .allowance(account, _routerAddress)
        .call();

      if (new BigNumber(lpAllowance).gt(0)) {
        dispatch({
          type: APPROVE_LP_TOKENS,
          payload: { pair: `${token0.symbol}_${token1.symbol}`, status: true },
        });
      } else {
        dispatch({
          type: APPROVE_LP_TOKENS,
          payload: { pair: `${token0.symbol}_${token1.symbol}`, status: false },
        });
      }
    } catch (error) {
      console.log("checkLpAllowance ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to check checkLpAllowance",
      });
    }
    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

export const confirmLPAllowance =
  (balance, token0, token1, pairAddress, account, chainId) =>
  async (dispatch) => {
    dispatch({
      type: SHOW_DEX_LOADING,
    });

    try {
      const _pairContract = pairContract(pairAddress, chainId);
      const _routerAddress = ROUTER_ADDRESS?.[chainId];

      await _pairContract.methods
        .approve(_routerAddress, balance)
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: {
                type: "lp_token_approve",
                hash: null,
                status: "failed",
              },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "lp_token_approve", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "lp_token_approve",
              status: "success",
              result: {}, // add result data
            },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "lp_token_approve", status: "failed" },
          });
        });

      dispatch({
        type: APPROVE_LP_TOKENS,
        payload: { pair: `${token0.symbol}_${token1.symbol}`, status: true },
      });
    } catch (error) {
      console.log("confirmLPAllowance ", error);
    }
    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

// load token list to be selected
const localTokenList = {
  1: ethereumTokens,
  4: testTokens.ethereum,
  56: tokenListBsc,
  97: testTokens.bsc,
};
export const loadTokens = (chainId) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
    });

    // todo: fetch token list from network
    const localTokens = localTokenList?.[!chainId ? 1 : chainId];

    const cachedTokens = getCachedTokens();
    const allTokens =
      cachedTokens.length > 0
        ? [...cachedTokens, ...localTokens]
        : [...localTokens];
    dispatch({
      type: LOAD_TOKEN_LIST,
      payload: allTokens,
    });
  } catch (error) {
    console.log("loadTokens ", error);
  }
  dispatch({
    type: HIDE_LOADING,
  });
};

export const importToken = (address, chainId) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_DEX_LOADING,
    });

    const _tokenContract = tokenContract(address, chainId);

    const [tokenInfoData, tokenDecimals] = await Promise.all([
      fetchTokenInfo(address, chainId),
      _tokenContract.methods.decimals().call(),
    ]);

    if (tokenInfoData.status === "0") {
      if (currentConnection === "testnet") {
        const tokenObj = {
          tokenName: "Test erc20 token",
          symbol: address && address.slice(0, 6),
          address: address,
          decimals: parseInt(tokenDecimals),
        };
        cacheImportedToken(tokenObj);
        dispatch({
          type: IMPORT_TOKEN,
          payload: {
            listData: tokenObj,
          },
        });
      }
    } else {
      const tokenInfo = tokenInfoData.result[0];
      const tokenObj = {
        name: tokenInfo.tokenName,
        symbol: tokenInfo.symbol,
        address: address,
        decimals: parseInt(tokenDecimals),
      };
      cacheImportedToken(tokenObj);
      dispatch({
        type: IMPORT_TOKEN,
        payload: {
          listData: tokenObj,
        },
      });
    }
  } catch (error) {
    console.log("importToken ", error);
  }
  dispatch({
    type: HIDE_DEX_LOADING,
  });
};

export const loadPairAddress =
  (token0Symbol, token1Symbol, pairAddress, chainId) => async (dispatch) => {
    try {
      dispatch({
        type: SHOW_DEX_LOADING,
      });

      const _data = {};
      _data[`${token0Symbol}_${token1Symbol}`] = pairAddress;

      dispatch({
        type: SET_PAIR_DATA,
        payload: _data,
      });
    } catch (error) {
      console.log("loadPairAddress ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Pair not founds",
      });
    }
    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

const fetchPairData = async (token0, token1, _pairContract, account) => {
  try {
    const [lpBalance, pairToken0Addr, reservesData, totalSupply] =
      await Promise.all([
        _pairContract.methods.balanceOf(account).call(),
        _pairContract.methods.token0().call(),
        _pairContract.methods.getReserves().call(),
        _pairContract.methods.totalSupply().call(),
      ]);

    let reserve = {};

    if (token0.address.toLowerCase() === pairToken0Addr.toLowerCase()) {
      reserve[token0.symbol] = reservesData._reserve0;
      reserve[token1.symbol] = reservesData._reserve1;
    } else {
      reserve[token0.symbol] = reservesData._reserve1;
      reserve[token1.symbol] = reservesData._reserve0;
    }

    return { reserve, lpBalance, totalSupply };
  } catch (error) {
    console.log("fetchPairData exeption ", error);
    return { reserve: "0", lpBalance: "0", totalSupply: "0" };
  }
};

export const getLpBalance =
  (token0, token1, pairAddress, account, chainId) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, chainId);

      dispatch({
        type: SHOW_DEX_LOADING,
      });

      const { reserve, totalSupply, lpBalance } = await fetchPairData(
        token0,
        token1,
        _pairContract,
        account
      );

      dispatch({
        type: SET_POOL_RESERVES,
        payload: reserve,
      });

      const _lpBalance = lpBalance;
      const _totalSupply = totalSupply;

      dispatch({
        type: GET_POOL_SHARE,
        payload: getPercentage(_lpBalance, _totalSupply),
      });

      dispatch({
        type: SET_LP_BALANCE,
        payload: {
          pair: `${token0.symbol}_${token1.symbol}`,
          amount: _lpBalance,
        },
      });
    } catch (error) {
      console.log("lpBalance ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to fetch lpBalance",
      });
    }

    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };
