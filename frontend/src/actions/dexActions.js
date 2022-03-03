import BigNumber from "bignumber.js";
import {
  currentConnection,
  ETH,
  moonriverNetwork,
  PBR,
  routerAddresses,
  swapFnConstants,
  THRESOLD_WEI_VALUE,
  tokenAddresses,
  USDC,
  USDT,
} from "../constants/index";
import {
  pairContract,
  routerContract,
  tokenContract,
} from "../contracts/connections";
import { getPairAddress } from "../utils/connectionUtils";
import {
  toWei,
  getUnixTime,
  getPercentage,
  cacheImportedToken,
  getCachedTokens,
  fromWei,
  sellPriceImpact,
  getTokenWithSymbol,
} from "../utils/helper";
import { fetchTokenInfo } from "../utils/helper";
import {
  APPROVE_LP_TOKENS,
  APPROVE_TOKEN,
  DEX_ERROR,
  GET_POOL_SHARE,
  GET_TOKEN_1_OUT,
  GET_TOKEN_O_IN,
  HIDE_DEX_LOADING,
  HIDE_LOADING,
  IMPORT_TOKEN,
  LOAD_TOKEN_LIST,
  SET_LP_BALANCE,
  SET_PAIR_DATA,
  SET_POOL_RESERVES,
  SHOW_DEX_LOADING,
  SHOW_LOADING,
  START_PRICE_LOADING,
  START_TRANSACTION,
  STOP_PRICE_LOADING,
  UPDATE_TRANSACTION_STATUS,
} from "./types";
import ethereumTokens from "../tokenList/tokenListEthereum.json";
import moonriverTokens from "../tokenList/tokenListMoonriver.json";
import testTokens from "../tokenList/tokenListTest.json";

// swap transaction function
export const swapTokens =
  (token0, token1, deadline, currentSwapFn, currenSwapPath, account, network) =>
  async (dispatch) => {
    try {
      const _routerContract = routerContract(network);

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
      dispatch({
        type: DEX_ERROR,
        payload: "Some went wrong with exchange",
      });
    }
    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

//token0 : { name, symbol, amount }, token1: {name, symbol, amount }
export const getPoolShare =
  (pairAddress, tokenA, tokenB, network) => async (dispatch) => {
    try {
      //Load pair contract of selected token pair
      const _pairContract = pairContract(pairAddress, network);

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
  (token0, token1, account, deadline, network) => async (dispatch) => {
    try {
      const _routerContract = routerContract(network);

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
  (ethToken, erc20Token, account, deadline, network) => async (dispatch) => {
    try {
      const _routerContract = routerContract(network);
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
  (token0, token1, account, lpAmount, deadline, network) =>
  async (dispatch) => {
    try {
      const _routerContract = routerContract(network);

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
  (ethToken, erc20Token, account, lpAmount, deadline, network) =>
  async (dispatch) => {
    try {
      const _routerContract = routerContract(network);

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
export const checkAllowance = (token, account, network) => async (dispatch) => {
  try {
    const _tokenContract = tokenContract(token.address, network);

    const _routerContract = routerContract(network);
    if (token.symbol === ETH) {
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
  (balance, token, account, network) => async (dispatch) => {
    try {
      const _tokenContract = tokenContract(token.address, network);

      // const _routerContract = routerContract(network);
      const _routerAddress = routerAddresses.ethereum;

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
  (token0, token1, pairAddress, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, network);
      // const _routerContract = routerContract(network);
      const _routerAddress = routerAddresses.ethereum;

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
  (balance, token0, token1, pairAddress, account, network) =>
  async (dispatch) => {
    dispatch({
      type: SHOW_DEX_LOADING,
    });

    try {
      const _pairContract = pairContract(pairAddress, network);
      const _routerContractAddress = Object.keys(routerAddresses).includes(
        network
      )
        ? routerAddresses?.[network]
        : routerAddresses.ethereum;

      await _pairContract.methods
        .approve(_routerContractAddress, balance)
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
export const loadTokens = (network) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
    });

    let localTokens = [];
    if (network === moonriverNetwork) {
      localTokens =
        currentConnection === "testnet"
          ? testTokens?.[network]
          : moonriverTokens;
    } else {
      localTokens =
        currentConnection === "testnet"
          ? testTokens?.[network]
          : ethereumTokens;
    }

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

export const importToken = (address, network) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_DEX_LOADING,
    });

    const _tokenContract = tokenContract(address, network);

    const [tokenInfoData, tokenDecimals] = await Promise.all([
      fetchTokenInfo(address),
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
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to importToken",
    });
  }
  dispatch({
    type: HIDE_DEX_LOADING,
  });
};

// token0 {input, address, symbol  }
export const getToken1OutAmount =
  (token0, token1, account, network) => async (dispatch) => {
    dispatch({ type: START_PRICE_LOADING });
    try {
      const _routerContract = routerContract(network);

      // calculate price from token0->weth->token path
      const wethAddress =
        currentConnection === "testnet"
          ? tokenAddresses.ethereum.ETH.testnet
          : tokenAddresses.ethereum.ETH.mainnet;
      const usdtAddress =
        currentConnection === "testnet"
          ? tokenAddresses.ethereum.USDT.testnet
          : tokenAddresses.ethereum.USDT.mainnet;

      const token0In = token0.amount;

      const _path0 = [token0.address, token1.address];
      const _path1 = [token0.address, wethAddress, token1.address];
      const _path2 = [token0.address, wethAddress, usdtAddress, token1.address];
      const _path21 = [
        token0.address,
        usdtAddress,
        wethAddress,
        token1.address,
      ]; // when usdc is token0
      const _path3 = [token0.address, usdtAddress, token1.address];

      let bridgePath = _path0;
      if (
        [PBR, USDT].includes(token0.symbol) &&
        [PBR, USDT].includes(token1.symbol)
      ) {
        bridgePath = _path1;
      } else if (
        [PBR, USDC].includes(token0.symbol) &&
        [PBR, USDC].includes(token1.symbol)
      ) {
        bridgePath = token0.symbol === PBR ? _path2 : _path21;
      } else if (
        [ETH, USDC].includes(token0.symbol) &&
        [ETH, USDC].includes(token1.symbol)
      ) {
        bridgePath = _path3;
      }

      // let amountsOutPair;
      let amountsOutBridge;
      let selectedPath = [];
      let resultOut = "0";

      const pairAddress = await getPairAddress(
        token0.address,
        token1.address,
        network
      );

      let reserve;

      if (pairAddress) {
        const _pairContract = pairContract(pairAddress, network);
        const pairReserveRes = await fetchPairData(
          token0,
          token1,
          _pairContract,
          account
        );
        reserve = pairReserveRes.reserve;
        // totalSupply = pairReserveRes.totalSupply;
        // lpBalance = pairReserveRes.lpBalance;
      }

      if (
        pairAddress &&
        reserve &&
        (new BigNumber(reserve[token0.symbol]).gt(THRESOLD_WEI_VALUE) ||
          new BigNumber(reserve[token1.symbol]).gt(THRESOLD_WEI_VALUE))
      ) {
        let amountsOutPair;
        try {
          amountsOutPair = await _routerContract.methods
            .getAmountOut(
              token0In,
              reserve[token0.symbol],
              reserve[token1.symbol]
            )
            .call();
        } catch (error) {
          amountsOutPair = "0";
        }

        resultOut = fromWei(amountsOutPair, token1.decimals);
        selectedPath = _path0;

        if (
          [token0.symbol, token1.symbol].includes(USDT) &&
          [token0.symbol, token1.symbol].includes(PBR)
        ) {
          //pbr-usdt fix if pair exist and not enough liquidity

          amountsOutBridge = await _routerContract.methods
            .getAmountsOut(token0In, _path0)
            .call();

          const token1OutBridge = new BigNumber(
            amountsOutBridge[amountsOutBridge.length - 1]
          );

          const _resultOutBridge = fromWei(
            token1OutBridge.toString(),
            token1.decimals
          );

          if (new BigNumber(resultOut).lt(_resultOutBridge)) {
            //consider swap from bridge instead of pair
            resultOut = _resultOutBridge;
            selectedPath = bridgePath;
          }
        }
      } else {
        //fix if it is bridge swap and token0 is usdc

        amountsOutBridge = await _routerContract.methods
          .getAmountsOut(token0In, bridgePath)
          .call();

        const token1OutBridge = new BigNumber(
          amountsOutBridge[amountsOutBridge.length - 1]
        );
        resultOut = fromWei(token1OutBridge.toString(), token1.decimals);
        selectedPath = bridgePath;
      }

      // fetch token usd price in AMM,
      // const [token0DerivedEth, token1DerivedEth, ethUsdValue] =
      //   await Promise.all([
      //     getCurrentTokenPriceInEth(token0.address),
      //     getCurrentTokenPriceInEth(token1.address),
      //     getOnlyCurrentEthPrice(),
      //   ]);

      dispatch({
        type: GET_TOKEN_1_OUT,
        payload: {
          tokenAmount: resultOut,
          // token0UsdValue: new BigNumber(token0DerivedEth)
          //   .times(ethUsdValue)
          //   .toString(),
          // token1UsdValue: new BigNumber(token1DerivedEth)
          //   .times(ethUsdValue)
          //   .toString(),
          selectedPath,
        },
      });
    } catch (error) {
      console.log("getToken1OutAmount error ", error);
      dispatch({
        type: GET_TOKEN_1_OUT,
        payload: { tokenAmount: "0", selectedPath: [] },
      });
    }

    dispatch({ type: STOP_PRICE_LOADING });
  };

// token0 {input,   }
export const getToken0InAmount =
  (token0, token1, account, network) => async (dispatch) => {
    dispatch({ type: START_PRICE_LOADING });
    try {
      const _routerContract = routerContract(network);
      // calculate price from token0->weth->token path
      const wethAddress =
        currentConnection === "testnet"
          ? tokenAddresses.ethereum.ETH.testnet
          : tokenAddresses.ethereum.ETH.mainnet;
      const usdtAddress =
        currentConnection === "testnet"
          ? tokenAddresses.ethereum.USDT.testnet
          : tokenAddresses.ethereum.USDT.mainnet;

      const token1Out = token1.amount;

      const _path0 = [token0.address, token1.address];
      const _path1 = [token0.address, wethAddress, token1.address];
      const _path2 = [token0.address, wethAddress, usdtAddress, token1.address];
      const _path21 = [
        token0.address,
        usdtAddress,
        wethAddress,
        token1.address,
      ]; // when usdc is token0
      const _path3 = [token0.address, usdtAddress, token1.address];

      let bridgePath = _path0;
      if (
        [PBR, USDT].includes(token0.symbol) &&
        [PBR, USDT].includes(token1.symbol)
      ) {
        bridgePath = _path1;
      } else if (
        [PBR, USDC].includes(token0.symbol) &&
        [PBR, USDC].includes(token1.symbol)
      ) {
        bridgePath = token0.symbol === PBR ? _path2 : _path21;
      } else if (
        [ETH, USDC].includes(token0.symbol) &&
        [ETH, USDC].includes(token1.symbol)
      ) {
        bridgePath = _path3;
      }

      let amountsInBridge;

      let selectedPath = [];
      let resultIn = "0";

      const pairAddress = await getPairAddress(
        token0.address,
        token1.address,
        network
      );

      let reserve;

      if (pairAddress) {
        const _pairContract = pairContract(pairAddress, network);
        const pairReserveRes = await fetchPairData(
          token0,
          token1,
          _pairContract,
          account
        );
        reserve = pairReserveRes.reserve;
        // totalSupply = pairReserveRes.totalSupply;
        // lpBalance = pairReserveRes.lpBalance;
      }

      if (
        pairAddress &&
        reserve &&
        (new BigNumber(reserve[token0.symbol]).gt(THRESOLD_WEI_VALUE) ||
          new BigNumber(reserve[token1.symbol]).gt(THRESOLD_WEI_VALUE))
      ) {
        // new
        let amountsInPair;
        try {
          amountsInPair = await _routerContract.methods
            .getAmountIn(
              token1Out,
              reserve[token0.symbol],
              reserve[token1.symbol]
            )
            .call();
        } catch (error) {
          amountsInPair = "0";
        }

        resultIn = fromWei(amountsInPair, token0.decimals);
        selectedPath = _path0;

        // temp fix for pbr-usdt pair with low liquidity
        if (
          [token0.symbol, token1.symbol].includes(USDT) &&
          [token0.symbol, token1.symbol].includes(PBR)
        ) {
          amountsInBridge = await _routerContract.methods
            .getAmountsIn(token1Out, bridgePath)
            .call();
          const token1OutWethBridge = new BigNumber(amountsInBridge[0]);

          const _resultInBridge = fromWei(
            token1OutWethBridge.toString(),
            token1.decimals
          );

          if (new BigNumber(resultIn).lt(_resultInBridge)) {
            //consider swap from bridge instead of pair
            resultIn = _resultInBridge;
            selectedPath = bridgePath;
          }
        }
      } else {
        //Note: token1Out should be in usdc decimals if we are fetching amount from path,
        // in normal wei if fetching from pair reserves

        amountsInBridge = await _routerContract.methods
          .getAmountsIn(token1Out, bridgePath)
          .call();
        const token1OutWethBridge = new BigNumber(amountsInBridge[0]);

        resultIn = fromWei(token1OutWethBridge.toString(), token0.decimals);
        selectedPath = bridgePath;
      }

      // // fetch token usd price in AMM,
      // const [token0DerivedEth, token1DerivedEth, ethUsdValue] =
      //   await Promise.all([
      //     getCurrentTokenPriceInEth(token0.address),
      //     getCurrentTokenPriceInEth(token1.address),
      //     getOnlyCurrentEthPrice(),
      //   ]);

      dispatch({
        type: GET_TOKEN_O_IN,
        payload: {
          tokenAmount: resultIn,
          // token0UsdValue: new BigNumber(token0DerivedEth)
          //   .times(ethUsdValue)
          //   .toString(),
          // token1UsdValue: new BigNumber(token1DerivedEth)
          //   .times(ethUsdValue)
          //   .toString(),
          selectedPath,
        },
      });
    } catch (error) {
      console.log("getToken0InAmount error ", { error });
      dispatch({
        type: GET_TOKEN_O_IN,
        payload: { tokenAmount: "0", selectedPath: [] },
      });

      dispatch({
        type: DEX_ERROR,
        payload: "getTokenOutAmount error",
      });
    }

    dispatch({ type: STOP_PRICE_LOADING });
  };

const fetchReservesForPriceImpactCalculation = async (
  token0,
  token1,
  account,
  network
) => {
  const token0Address = token0?.address;

  const baseToken =
    token0.symbol === ETH ? getTokenWithSymbol(USDT) : getTokenWithSymbol(ETH);

  const baseToken1 =
    token0.symbol === USDC
      ? getTokenWithSymbol(USDT)
      : getTokenWithSymbol(USDC);

  const token1Address = token1?.address;

  //check pair token0 token1
  let pairAddress = await getPairAddress(token0Address, token1Address, network);
  let _pairContract;
  let pairReserves = {};
  if (pairAddress) {
    // fetch reserves from pair and return
    _pairContract = pairContract(pairAddress, network);
    pairReserves = await fetchPairData(token0, token1, _pairContract, account);

    return { ...pairReserves.reserve };
  }
  // check pair token0+baseToken
  pairAddress = await getPairAddress(token0Address, baseToken.address, network);

  if (pairAddress) {
    _pairContract = pairContract(pairAddress, network);
    pairReserves = await fetchPairData(
      token0,
      baseToken,
      _pairContract,
      account
    );

    return { ...pairReserves.reserve };
  }

  // check pair token1+baseToken
  pairAddress = await getPairAddress(
    token0Address,
    baseToken1.address,
    network
  );

  if (pairAddress) {
    _pairContract = pairContract(pairAddress, network);
    pairReserves = await fetchPairData(
      token0,
      baseToken1,
      _pairContract,
      account
    );

    return { ...pairReserves.reserve };
  }
};

const tokenThresoldValue = (decimals) => {
  return new BigNumber(10).exponentiatedBy(parseInt(decimals) - 3);
};

export const calculatePriceImpact = async (
  token0,
  token1,
  account,
  network
) => {
  try {
    const pairAddress = await getPairAddress(
      token0.address,
      token1.address,
      network
    );

    let reserve;

    if (pairAddress) {
      const _pairContract = pairContract(pairAddress, network);
      const pairReserveRes = await fetchPairData(
        token0,
        token1,
        _pairContract,
        account
      );
      reserve = pairReserveRes.reserve;
      // totalSupply = pairReserveRes.totalSupply;
      // lpBalance = pairReserveRes.lpBalance;
    }

    if (
      pairAddress &&
      reserve &&
      (new BigNumber(reserve[token0.symbol]).gt(
        tokenThresoldValue(token0.decimals)
      ) ||
        new BigNumber(reserve[token1.symbol]).gt(
          tokenThresoldValue(token1.decimals)
        ))
    ) {
      return sellPriceImpact(
        fromWei(token0.amount, token0.decimals),
        fromWei(token1.amount, token1.decimals),
        fromWei(reserve[token0.symbol], token0.decimals)
      );
    } else {
      const reserves = await fetchReservesForPriceImpactCalculation(
        token0,
        token1,
        account,
        network
      );

      return sellPriceImpact(
        fromWei(token0.amount, token0.decimals),
        fromWei(token1.amount, token1.decimals),
        fromWei(reserves[token0.symbol], token0.decimals)
      );
    }
  } catch (error) {
    console.log("checkPriceImpact calculatePriceImpact exeption : ", { error });
  }
};
export const loadPairAddress =
  (token0Symbol, token1Symbol, pairAddress, network) => async (dispatch) => {
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
  (token0, token1, pairAddress, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, network);

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
