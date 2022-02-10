import BigNumber from "bignumber.js";
import {
  currentConnection,
  ETH,
  etheriumNetwork,
  PBR,
  routerAddresses,
  swapFnConstants,
  THRESOLD_WEI_VALUE,
  tokenAddresses,
  USDC,
  USDT,
} from "../constants";
import {
  getCurrentTokenPriceInEth,
  getOnlyCurrentEthPrice,
} from "../contexts/GlobalData";
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
  fetchTokenInfo,
  cacheImportedToken,
  getCachedTokens,
  fromWei,
  sellPriceImpact,
  getTokenWithSymbol,
} from "../utils/helper";
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

// const getCurrentGasLimit = (path) => {
//   if (path.length < 3) {
//     return 200000;
//   } else if (path.length === 3) {
//     return 250000;
//   } else if (path.length === 4) {
//     return 300000;
//   } else {
//     return 200000;
//   }
// };

// swap transaction function
export const swapTokens =
  (token0, token1, deadline, currentSwapFn, currenSwapPath, account, network) =>
  async (dispatch) => {
    try {
      // console.log("swapExactEthForTokens");
      const _routerContract = routerContract(network);

      const token0In = token0.amount;
      const token1In = token1.amount;

      const token0Min = 0; //token0.min; // todo: veirfy min amount out with henry and update this
      const token1Min = 0; //token1.min;

      const path = currenSwapPath; //[token0.address, token1.address];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);
      dispatch({
        type: SHOW_LOADING,
      });
      dispatch({ type: START_TRANSACTION });

      // console.log("swapTokens:  inputs -->", { token0In, token1In, token0Min, token1Min, path, toAddress, _deadlineUnix, currentSwapFn })

      let swapPromise;
      if (currentSwapFn === swapFnConstants.swapExactETHForTokens) {
        //case 1
        // console.log('swapTokens:  case 1 swapExactETHForTokens')
        swapPromise = _routerContract.methods
          .swapExactETHForTokens(token1Min, path, toAddress, _deadlineUnix)
          .send(
            { from: account, value: token0In },
            function (error, transactionHash) {
              // console.log('swapTokens: UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
        // case 2
        // console.log('swapTokens:  case 2 swapETHforExactTokens')
        swapPromise = _routerContract.methods
          .swapExactETHForTokens(token1Min, path, toAddress, _deadlineUnix)
          .send(
            { from: account, value: token0In },
            function (error, transactionHash) {
              // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
        // case 3
        // console.log('swapTokens:  case 3 swapExactTokensForETH')

        swapPromise = _routerContract.methods
          .swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
        // case 4
        // console.log('swapTokens:  case 4 swapTokensForExactETH')

        swapPromise = _routerContract.methods
          .swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
        // case 5
        // console.log('swapTokens:  case 5 swapExactTokensForTokens')

        swapPromise = _routerContract.methods
          .swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
        // console.log('swapTokens:  case 6 swapTokensForExactTokens')

        swapPromise = _routerContract.methods
          .swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          )
          .send({ from: account }, function (error, transactionHash) {
            // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
          console.log("UPDATE_TRANSACTION_STATUS", receipt);
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
          // console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "swap", status: "failed" },
          });
        });

      // console.log({ token0, token1 });
    } catch (error) {
      console.log("swapTokens: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Some went wrong with exchange",
      });
    }
    dispatch({
      type: HIDE_LOADING,
    });
  };

//token0 : { name, symbol, amount }, token1: {name, symbol, amount }
export const getPoolShare =
  (pairAddress, tokenA, tokenB, network) => async (dispatch) => {
    try {
      //Load pair contract of selected token pair
      const _pairContract = pairContract(pairAddress, network);

      const [token0Address, token1Address, reservesData] = await Promise.all([
        _pairContract.methods.token0().call(),
        _pairContract.methods.token1().call(),
        _pairContract.methods.getReserves().call(),
      ]);
      // console.log({ token0Address, token1Address, reservesData });
      let tokenAReserve = "0";
      let tokenBReserve = "0";
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
        type: SHOW_LOADING,
      });
      //input params
      const token0AmountDesired = token0.amount;
      const token0AmountMin = "0";
      const token1AmountDesired = token1.amount;
      const token1AmountMin = "0";

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);
      // console.log({
      //   address0: token0.address,
      //   address1: token1.address,
      //   token0AmountDesired,
      //   token1AmountDesired,
      //   token0AmountMin,
      //   token1AmountMin,
      //   account,
      //   _deadlineUnix,
      // });
      dispatch({ type: START_TRANSACTION });
      const liquidity = await _routerContract.methods
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
          // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
          // console.log('UPDATE_TRANSACTION_STATUS', receipt)
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
          // console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "add", status: "failed" },
          });
        });

      // console.log(liquidity);
    } catch (error) {
      console.log("addLiquidity: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }

    dispatch({
      type: HIDE_LOADING,
    });
  };

// token0: { amount: "", address: "", desired:"", min:"" }
// token1 { amount: "", address: "", desired:"", min:"" }
export const addLiquidityEth =
  (ethToken, erc20Token, account, deadline, network) => async (dispatch) => {
    try {
      // console.log({ token0: ethToken, token1: erc20Token });
      // const _tokenContract = getTokenContract(network, erc20Token.symbol);
      const _routerContract = routerContract(network);
      // console.log('addLiquidityEth')
      dispatch({
        type: SHOW_LOADING,
      });
      //input params
      const etherAmount = ethToken.amount;
      const etherAmountMin = "0";
      const tokenAmountDesired = erc20Token.amount;
      const tokenAmountMin = "0";
      const tokenAddress = erc20Token.address;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);
      // console.log('addLiquidity  in', {
      //   tokenAddress: tokenAddress,
      //   tokenAmountDesired,
      //   tokenAmountMin,
      //   etherAmountMin,
      //   account,
      //   router: _routerContract._address,
      //   _deadlineUnix,
      // });
      dispatch({ type: START_TRANSACTION });
      const liquidity = await _routerContract.methods
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
            // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
          // console.log('UPDATE_TRANSACTION_STATUS', receipt)
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
          // console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "add", status: "failed" },
          });
        });

      // console.log(liquidity);
    } catch (error) {
      console.log("addLiquidityEth: ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to add liquidity",
      });
    }

    dispatch({
      type: HIDE_LOADING,
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
      // const token0AmountDesired = token0.amount;
      const token0AmountMin = "0";
      // const token1AmountDesired = token1.amount;
      const token1AmountMin = "0";

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);
      // console.log({
      //   address0: token0.address,
      //   address1: token1.address,

      //   account,
      //   lpAmount,
      //   _deadlineUnix,
      // });
      dispatch({ type: START_TRANSACTION });
      const liquidity = await _routerContract.methods
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
          // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
          // console.log('UPDATE_TRANSACTION_STATUS', receipt)
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
          // console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "remove", status: "failed" },
          });
        });

      // console.log(liquidity);
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

      console.log({ ethToken, erc20Token, lpAmount });
      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({ type: START_TRANSACTION });
      const rmLiquidity = await _routerContract.methods
        .removeLiquidityETH(
          erc20Address,
          lpTokenAmount,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account }, function (error, transactionHash) {
          // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
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
          // console.log('UPDATE_TRANSACTION_STATUS', receipt)
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
          // console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "remove", status: "failed" },
          });
        });

      // console.log(rmLiquidity);
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

    // console.log("allowance ", tokenAllowance);
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

      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_LOADING,
      });
      const tokenAllowance = await _tokenContract.methods
        .approve(_routerContract._address, balance)
        .send({ from: account });

      dispatch({
        type: APPROVE_TOKEN,
        payload: { symbol: token.symbol, status: true },
      });
      // console.log("allowance confirmed ", tokenAllowance);
    } catch (error) {
      console.log("confirmAllowance ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to confirm allowance",
      });
    }
    dispatch({
      type: HIDE_LOADING,
    });
  };

export const checkLpAllowance =
  (token0, token1, pairAddress, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, network);
      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_DEX_LOADING,
      });

      const lpAllowance = await _pairContract.methods
        .allowance(account, _routerContract._address)
        .call();

      // console.log("allowance ", tokenAllowance);
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
      // console.log("Test: lp allowance ", lpAllowance);
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
    try {
      const _pairContract = pairContract(pairAddress, network);
      const _routerContractAddress =
        currentConnection === "mainnet"
          ? routerAddresses.ethereum.mainnet
          : routerAddresses.ethereum.testnet;

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      await _pairContract.methods
        .approve(_routerContractAddress, balance)
        .send({ from: account });

      dispatch({
        type: APPROVE_LP_TOKENS,
        payload: { pair: `${token0.symbol}_${token1.symbol}`, status: true },
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

// load token list to be selected
export const loadTokens = (network) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
    });

    let localTokens = [];
    if (network === etheriumNetwork) {
      localTokens =
        currentConnection === "testnet"
          ? testTokens?.[network]
          : ethereumTokens;
    } else {
      localTokens =
        currentConnection === "testnet"
          ? testTokens?.[network]
          : moonriverTokens;
    }

    console.log("load tokens ", { localTokens, network });
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

export const importToken = (address, account, network) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_DEX_LOADING,
    });

    const _tokenContract = tokenContract(address, network);

    const [tokenInfoData, tokenDecimals] = await Promise.all([
      fetchTokenInfo(address),
      _tokenContract.methods.decimals().call(),
    ]);

    // console.log("token info received ", tokenInfoData);

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
      console.log("token not found");
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

      const pairAddress = await getPairAddress(token0.address, token1.address);

      let reserve, totalSupply, lpBalance;

      if (pairAddress) {
        const _pairContract = pairContract(pairAddress, network);
        const pairReserveRes = await fetchPairData(
          token0,
          token1,
          _pairContract,
          account
        );
        reserve = pairReserveRes.reserve;
        totalSupply = pairReserveRes.totalSupply;
        lpBalance = pairReserveRes.lpBalance;
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

        // console.log({ amountsOutPair })
        resultOut = fromWei(amountsOutPair, token1.decimals);
        selectedPath = _path0;

        // console.log('getToken1OutAmount getting from pair')

        if (
          [token0.symbol, token1.symbol].includes(USDT) &&
          [token0.symbol, token1.symbol].includes(PBR)
        ) {
          //pbr-usdt fix if pair exist and not enough liquidity
          // const _token0In = toWei(fromWei(token0In), token0.decimals)  //DECIMAL_6_ADDRESSES.includes(token0.address) ? toWei(fromWei(token0In), 6) : token0In;

          amountsOutBridge = await _routerContract.methods
            .getAmountsOut(token0In, _path0)
            .call();

          const token1OutBridge = new BigNumber(
            amountsOutBridge[amountsOutBridge.length - 1]
          );
          // console.log('getToken1OutAmount fetching from bridge ', { amountsOutBridge, bridgePath, token1OutBridge: token1OutBridge.toString() })
          const _resultOutBridge = fromWei(
            token1OutBridge.toString(),
            token1.decimals
          ); //DECIMAL_6_ADDRESSES.includes(token1.address) ? fromWei(token1OutBridge.toString(), 6) : fromWei(token1OutBridge.toString());

          if (new BigNumber(resultOut).lt(_resultOutBridge)) {
            //consider swap from bridge instead of pair
            resultOut = _resultOutBridge;
            selectedPath = bridgePath;
            // console.log('getToken1OutAmount swap using bridge out amount')
          }
        }
      } else {
        //fix if it is bridge swap and token0 is usdc
        // const _token0In = toWei(fromWei(token0In), token0.decimals)// DECIMAL_6_ADDRESSES.includes(token0.address) ? toWei(fromWei(token0In), 6) : token0In;

        amountsOutBridge = await _routerContract.methods
          .getAmountsOut(token0In, bridgePath)
          .call();

        const token1OutBridge = new BigNumber(
          amountsOutBridge[amountsOutBridge.length - 1]
        );
        // console.log('getToken1OutAmount fetching from bridge ', { amountsOutBridge, bridgePath, token1OutBridge: token1OutBridge.toString() })
        resultOut = fromWei(token1OutBridge.toString(), token1.decimals); //DECIMAL_6_ADDRESSES.includes(token1.address) ? fromWei(token1OutBridge.toString(), 6) : fromWei(token1OutBridge.toString());
        selectedPath = bridgePath;
      }

      // fetch token usd price in AMM,
      const [token0DerivedEth, token1DerivedEth, ethUsdValue] =
        await Promise.all([
          getCurrentTokenPriceInEth(token0.address),
          getCurrentTokenPriceInEth(token1.address),
          getOnlyCurrentEthPrice(),
        ]);

      dispatch({
        type: GET_TOKEN_1_OUT,
        payload: {
          tokenAmount: resultOut,
          token0UsdValue: new BigNumber(token0DerivedEth)
            .times(ethUsdValue)
            .toString(),
          token1UsdValue: new BigNumber(token1DerivedEth)
            .times(ethUsdValue)
            .toString(),
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

      // if ((DECIMAL_6_ADDRESSES.includes(token0.address) || DECIMAL_6_ADDRESSES.includes(token1.address)) && (token0.symbol === ETH || token1.symbol === ETH)) {
      //   bridgePath = _path3;
      // } else {
      //   bridgePath = (DECIMAL_6_ADDRESSES.includes(token0.address) || DECIMAL_6_ADDRESSES.includes(token1.address))
      //     ? DECIMAL_6_ADDRESSES.includes(token0.address) ? _path21 : _path2
      //     : _path1;
      // }

      let amountsInPair;
      let amountsInBridge;

      let selectedPath = [];
      let resultIn = "0";

      const pairAddress = await getPairAddress(token0.address, token1.address);

      let reserve, totalSupply, lpBalance;

      if (pairAddress) {
        const _pairContract = pairContract(pairAddress, network);
        const pairReserveRes = await fetchPairData(
          token0,
          token1,
          _pairContract,
          account
        );
        reserve = pairReserveRes.reserve;
        totalSupply = pairReserveRes.totalSupply;
        lpBalance = pairReserveRes.lpBalance;
      }
      // console.log({ reserve, totalSupply, lpBalance })

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
        // console.log({ amountsInPair })
        resultIn = fromWei(amountsInPair, token0.decimals);
        selectedPath = _path0;

        // temp fix for pbr-usdt pair with low liquidity
        if (
          [token0.symbol, token1.symbol].includes(USDT) &&
          [token0.symbol, token1.symbol].includes(PBR)
        ) {
          // const _token1OutWei = toWei(fromWei(token1Out), token1.decimals) //DECIMAL_6_ADDRESSES.includes(token1.address) ? toWei(fromWei(token1Out), 6) : token1Out;

          amountsInBridge = await _routerContract.methods
            .getAmountsIn(token1Out, bridgePath)
            .call();
          const token1OutWethBridge = new BigNumber(amountsInBridge[0]);

          const _resultInBridge = fromWei(
            token1OutWethBridge.toString(),
            token1.decimals
          ); //DECIMAL_6_ADDRESSES.includes(token0.address) ? fromWei(token1OutWethBridge.toString(), 6) : fromWei(token1OutWethBridge.toString());

          if (new BigNumber(resultIn).lt(_resultInBridge)) {
            //consider swap from bridge instead of pair
            resultIn = _resultInBridge;
            selectedPath = bridgePath;
            // console.log('getToken0InAmount swap using bridge out amount')
          }
        }
      } else {
        //Note: token1Out should be in usdc decimals if we are fetching amount from path,
        // in normal wei if fetching from pair reserves

        // const _token1OutWei = toWei(fromWei(token1Out), token1.decimals) //DECIMAL_6_ADDRESSES.includes(token1.address) ? toWei(fromWei(token1Out), 6) : token1Out;

        amountsInBridge = await _routerContract.methods
          .getAmountsIn(token1Out, bridgePath)
          .call();
        const token1OutWethBridge = new BigNumber(amountsInBridge[0]);

        resultIn = fromWei(token1OutWethBridge.toString(), token0.decimals); //DECIMAL_6_ADDRESSES.includes(token0.address) ? fromWei(token1OutWethBridge.toString(), 6) : fromWei(token1OutWethBridge.toString());
        selectedPath = bridgePath;
      }

      // fetch token usd price in AMM,
      const [token0DerivedEth, token1DerivedEth, ethUsdValue] =
        await Promise.all([
          getCurrentTokenPriceInEth(token0.address),
          getCurrentTokenPriceInEth(token1.address),
          getOnlyCurrentEthPrice(),
        ]);

      dispatch({
        type: GET_TOKEN_O_IN,
        payload: {
          tokenAmount: resultIn,
          token0UsdValue: new BigNumber(token0DerivedEth)
            .times(ethUsdValue)
            .toString(),
          token1UsdValue: new BigNumber(token1DerivedEth)
            .times(ethUsdValue)
            .toString(),
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
    token0.symbol === ETH || token1.symbol === ETH
      ? getTokenWithSymbol(USDT)
      : getTokenWithSymbol(ETH);

  const token1Address = token1?.address;

  console.log("reserveTest ", { token0, token1, baseToken });
  //check pair token0 token1
  let pairAddress = await getPairAddress(token0Address, token1Address, network);
  console.log("reserveTest pairAddress ", pairAddress);
  let _pairContract;
  let pairReserves = {};
  if (pairAddress) {
    // fetch reserves from pair and return
    _pairContract = pairContract(pairAddress, network);
    console.log("reserveTest pair contract ", _pairContract);
    pairReserves = await fetchPairData(token0, token1, _pairContract, account);

    console.log("reserveTest pair found with reserves ", pairReserves);
    return { ...pairReserves.reserve };
  }
  // check pair token0+baseToken
  pairAddress = await getPairAddress(token0Address, baseToken.address, network);

  console.log("reserveTest pairAddress token0+baseToken", pairAddress);

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
  pairAddress = await getPairAddress(token1Address, baseToken.address, network);

  console.log("reserveTest pairAddress token1+baseToken", pairAddress);
  if (pairAddress) {
    _pairContract = pairContract(pairAddress, network);
    pairReserves = await fetchPairData(
      token1,
      baseToken,
      _pairContract,
      account
    );

    return { ...pairReserves.reserve };
  }
};

// const getReservesForPriceImpact = async (token0, token1, account, network) => {
//   if (
//     [PBR, USDT].includes(token0.symbol) &&
//     [PBR, USDT].includes(token1.symbol)
//   ) {
//     // fetch all reserves
//     const wethAddress =
//       currentConnection === "testnet"
//         ? tokenAddresses.ethereum.ETH.testnet
//         : tokenAddresses.ethereum.ETH.mainnet;
//     const pbrAddress = token0.symbol === PBR ? token0.address : token1.address;
//     const usdtAddress =
//       token0.symbol === USDT ? token0.address : token1.address;

//     //pbr-eth
//     const pair0Address = await getPairAddress(pbrAddress, wethAddress);
//     const pair0Contract = pairContract(pair0Address, network);
//     const pair0Reserves = await fetchPairData(
//       { address: pbrAddress, symbol: PBR },
//       { address: wethAddress, symbol: ETH },
//       pair0Contract,
//       account
//     );

//     //eth-usdt
//     const pair1Address = await getPairAddress(usdtAddress, wethAddress);
//     const pair1Contract = pairContract(pair1Address, network);
//     const pair1Reserves = await fetchPairData(
//       { address: wethAddress, symbol: ETH },
//       { address: usdtAddress, symbol: USDT },
//       pair1Contract,
//       account
//     );

//     return { ...pair0Reserves.reserve, ...pair1Reserves.reserve };
//   } else if (
//     [PBR, USDC].includes(token0.symbol) &&
//     [PBR, USDC].includes(token0.symbol)
//   ) {
//     // console.log('getting reserves for pbr usdt ')
//     //
//     const wethAddress =
//       currentConnection === "testnet"
//         ? tokenAddresses.ethereum.ETH.testnet
//         : tokenAddresses.ethereum.ETH.mainnet;
//     const usdtAddress =
//       currentConnection === "testnet"
//         ? tokenAddresses.ethereum.USDT.testnet
//         : tokenAddresses.ethereum.USDT.mainnet;
//     const usdcAddress =
//       token0.symbol === USDC ? token0.address : token1.address;
//     const pbrAddress = token0.symbol === PBR ? token0.address : token1.address;

//     // //pbr-eth
//     const pair0Address = await getPairAddress(pbrAddress, wethAddress);
//     const pair0Contract = pairContract(pair0Address, network);
//     const pair0Reserves = await fetchPairData(
//       { address: pbrAddress, symbol: PBR },
//       { address: wethAddress, symbol: ETH },
//       pair0Contract,
//       account
//     );

//     // console.log('usdc-pbr pair ', pair0Address)
//     // //eth-usdt
//     // const pair1Address = await getPairAddress(usdtAddress, wethAddress)
//     // const pair1Contract = pairContract(pair1Address, network)
//     // const pair1Reserves = await fetchPairData({ address: wethAddress, symbol: ETH }, { address: usdtAddress, symbol: USDT }, pair1Contract, account);

//     //usdt-usdc
//     const pair2Address = await getPairAddress(usdtAddress, usdcAddress);
//     const pair2Contract = pairContract(pair2Address, network);
//     const pair2Reserves = await fetchPairData(
//       { address: usdtAddress, symbol: USDT },
//       { address: usdcAddress, symbol: USDC },
//       pair2Contract,
//       account
//     );

//     // console.log('checkPriceImpact:  ', { pair2Reserves })
//     return { ...pair2Reserves.reserve, ...pair0Reserves.reserve };
//   } else if (
//     [ETH, USDC].includes(token0.symbol) &&
//     [ETH, USDC].includes(token1.symbol)
//   ) {
//     //
//     const usdtAddress =
//       currentConnection === "testnet"
//         ? tokenAddresses.ethereum.USDT.testnet
//         : tokenAddresses.ethereum.USDT.mainnet;
//     const ethAddress = token0.symbol === ETH ? token0.address : token1.address;
//     const usdcAddress =
//       token0.symbol === USDC ? token0.address : token1.address;

//     //eth-usdt
//     const pair0Address = await getPairAddress(ethAddress, usdtAddress);
//     const pair0Contract = pairContract(pair0Address, network);
//     const pair0Reserves = await fetchPairData(
//       { address: ethAddress, symbol: ETH },
//       { address: usdtAddress, symbol: USDT },
//       pair0Contract,
//       account
//     );

//     //usdt-usdc
//     const pair1Address = await getPairAddress(usdcAddress, usdtAddress);
//     const pair1Contract = pairContract(pair1Address, network);
//     const pair1Reserves = await fetchPairData(
//       { address: usdtAddress, symbol: USDT },
//       { address: usdcAddress, symbol: USDC },
//       pair1Contract,
//       account
//     );

//     return { ...pair0Reserves.reserve, ...pair1Reserves.reserve };
//   }
// };

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
    const pairAddress = await getPairAddress(token0.address, token1.address);

    let reserve, totalSupply, lpBalance;

    if (pairAddress) {
      const _pairContract = pairContract(pairAddress, network);
      const pairReserveRes = await fetchPairData(
        token0,
        token1,
        _pairContract,
        account
      );
      reserve = pairReserveRes.reserve;
      totalSupply = pairReserveRes.totalSupply;
      lpBalance = pairReserveRes.lpBalance;
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

      // const _token0WeiAmount = toWei(fromWei(token0.amount, token0.decimals));
      // const _token1WeiAmount = toWei(fromWei(token1.amount, token1.decimals));
      console.log("checkPriceImpact fetched reserves0  ", { reserves });
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
    const [
      lpBalance,
      pairToken0Addr,
      pairToken1Addr,
      reservesData,
      totalSupply,
    ] = await Promise.all([
      _pairContract.methods.balanceOf(account).call(),
      _pairContract.methods.token0().call(),
      _pairContract.methods.token1().call(),
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
    // console.log("getting balance", { token0, token1 });
    try {
      const _pairContract = pairContract(pairAddress, network); // pairContract2(pairData, network);

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

      // formatting fix for non 18 decimal tokens
      const _lpDecimals =
        (parseInt(token0.decimals) + parseInt(token1.decimals)) / 2;
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
