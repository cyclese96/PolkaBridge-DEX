import BigNumber from "bignumber.js";
import {
  bscTokens,
  currentConnection,
  DECIMAL_6_ADDRESSES,
  ETH,
  etheriumNetwork,
  nullAddress,
  supportedTokens,
  swapFnConstants,
  tokens,
  usdtMainnetAddress,
  usdtTestnetAddress,
  WETH_ADDRESS_MAINNET,
  WETH_ADDRESS_TESTNET,
} from "../constants";
import {
  factoryContract,
  pairContract,
  pairContract2,
  routerContract,
  tokenContract,
} from "../contracts/connections";
import { getPairAddress } from "../utils/connectionUtils";
import {
  toWei,
  getTokenContract,
  getUnixTime,
  getPercentage,
  fetchTokenAbi,
  fetchTokenInfo,
  cacheImportedToken,
  getCachedTokens,
  fromWei,
} from "../utils/helper";
import {
  APPROVE_LP_TOKENS,
  APPROVE_TOKEN,
  DEX_ERROR,
  GET_PAIR_RESERVES,
  GET_POOL_SHARE,
  HIDE_DEX_LOADING,
  HIDE_LOADING,
  IMPORT_TOKEN,
  LOAD_TOKEN_LIST,
  RESET_POOL_DATA,
  SET_LP_BALANCE,
  SET_PAIR_DATA,
  SET_POOL_RESERVES,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
  SHOW_DEX_LOADING,
  SHOW_LOADING,
  START_TRANSACTION,
  UPDATE_TRANSACTION_STATUS,
  VERIFY_SLIPPAGE,
} from "./types";


// swap transaction function
export const swapTokens =
  (token0, token1, deadline, currentSwapFn, currenSwapPath, account, network) => async (dispatch) => {
    try {
      console.log("swapExactEthForTokens");
      const _routerContract = routerContract(network);

      const token0In = token0.amount;
      const token1In = token1.amount;

      const token0Min = 0//token0.min; // todo: veirfy min amount out with henry and update this
      const token1Min = 0//token1.min;

      const path = currenSwapPath//[token0.address, token1.address];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);
      dispatch({
        type: SHOW_LOADING,
      });
      dispatch({ type: START_TRANSACTION })

      console.log("swapTokens:  inputs -->", { token0In, token1In, token0Min, token1Min, path, toAddress, _deadlineUnix, currentSwapFn })


      let swapPromise;
      if (currentSwapFn === swapFnConstants.swapExactETHForTokens) {//case 1
        console.log('swapTokens:  case 1 swapExactETHForTokens')
        swapPromise = _routerContract.methods
          .swapExactETHForTokens(
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          ).send({ from: account, value: token0In }, function (error, transactionHash) {

            console.log('swapTokens: UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: transactionHash }
              })
            }

          })

      } else if (currentSwapFn === swapFnConstants.swapETHforExactTokens) { // case 2
        console.log('swapTokens:  case 2 swapETHforExactTokens')
        swapPromise = _routerContract.methods
          .swapExactETHForTokens(
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          ).send({ from: account, value: token0In }, function (error, transactionHash) {

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: transactionHash }
              })
            }

          })

      } else if (currentSwapFn === swapFnConstants.swapExactTokensForETH) { // case 3
        console.log('swapTokens:  case 3 swapExactTokensForETH')

        swapPromise = _routerContract.methods
          .swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          ).send({ from: account }, function (error, transactionHash) {

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: transactionHash }
              })
            }

          })

      } else if (currentSwapFn === swapFnConstants.swapTokensForExactETH) { // case 4
        console.log('swapTokens:  case 4 swapTokensForExactETH')

        swapPromise = _routerContract.methods
          .swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          ).send({ from: account }, function (error, transactionHash) {

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: transactionHash }
              })
            }

          })

      } else if (currentSwapFn === swapFnConstants.swapExactTokensForTokens) { // case 5
        console.log('swapTokens:  case 5 swapExactTokensForTokens')

        swapPromise = _routerContract.methods
          .swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          ).send({ from: account }, function (error, transactionHash) {

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: transactionHash }
              })
            }

          })

      } else { // case 6 swapTokensForExactTokens
        console.log('swapTokens:  case 6 swapTokensForExactTokens')

        swapPromise = _routerContract.methods
          .swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix
          ).send({ from: account }, function (error, transactionHash) {

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'swap', hash: transactionHash }
              })
            }

          })

      }

      await swapPromise
        .on('receipt', async function (receipt) {

          console.log('UPDATE_TRANSACTION_STATUS', receipt)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: 'swap', status: 'success', result: { token0, token1 } }
          })

        }).on("error", async function (error) {

          console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: 'swap', status: 'failed' }
          })
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
  (pairAddress, tokenA, tokenB, network) =>
    async (dispatch) => {
      try {
        //Load pair contract of selected token pair
        const _pairContract = pairContract(pairAddress, network);

        // const erc20TokenSymbol =
        //   token0Symbol === ETH ? token1Symbol : token0Symbol;
        // const erc20InputValue = token0Symbol === ETH ? token1Input : token0Input;
        // const _erc20Contract = getTokenContract(network, erc20TokenSymbol);

        // const inputTokenValue = toWei(erc20InputValue);

        // if (!_pairContract) {
        //   dispatch({
        //     type: GET_POOL_SHARE,
        //     payload: getPercentage(inputTokenValue, "0"),
        //   });
        //   return;
        // }

        const [token0Address, token1Address, reservesData] = await Promise.all([
          _pairContract.methods.token0().call(),
          _pairContract.methods.token1().call(),
          _pairContract.methods.getReserves().call(),
        ]);
        // console.log({ token0Address, token1Address, reservesData });
        let tokenAReserve = '0';
        let tokenBReserve = '0';
        if (tokenA.address === token0Address) {
          tokenAReserve = reservesData._reserve0;
        } else {
          tokenAReserve = reservesData._reserve1;
        }

        // const reserveTokenValue = tokenAReserve ? tokenAReserve : "0";

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
      dispatch({ type: START_TRANSACTION })
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

          console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'add', hash: null, status: 'failed' }
            })
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'add', hash: transactionHash }
            })
          }

        }).on('receipt', async function (receipt) {

          console.log('UPDATE_TRANSACTION_STATUS', receipt)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: 'add', status: 'success', result: { token0, token1 } }
          })

        }).on("error", async function (error) {

          console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: 'add', status: 'failed' }
          })

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
      console.log('addLiquidityEth')
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
      dispatch({ type: START_TRANSACTION })
      const liquidity = await _routerContract.methods
        .addLiquidityETH(
          tokenAddress,
          tokenAmountDesired,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account, value: toWei(etherAmount) }, function (error, transactionHash) {

          console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'add', hash: null, status: 'failed' }
            })
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'add', hash: transactionHash }
            })
          }

        }).on('receipt', async function (receipt) {

          console.log('UPDATE_TRANSACTION_STATUS', receipt)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: 'add', status: 'success', result: { token0: ethToken, token1: erc20Token } }
          })

        }).on("error", async function (error) {

          console.log('UPDATE_TRANSACTION_STATUS error', error)
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: 'add', status: 'failed' }
          })

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
        dispatch({ type: START_TRANSACTION })
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

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'remove', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'remove', hash: transactionHash }
              })
            }

          }).on('receipt', async function (receipt) {

            console.log('UPDATE_TRANSACTION_STATUS', receipt)
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'remove', status: 'success', result: { token0, token1, lpAmount } }
            })

          }).on("error", async function (error) {

            console.log('UPDATE_TRANSACTION_STATUS error', error)
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'remove', status: 'failed' }
            })

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
        // const _tokenContract = getTokenContract(network, erc20Token.symbol);
        const _routerContract = routerContract(network);

        dispatch({
          type: SHOW_DEX_LOADING,
        });
        //input params
        // const etherAmount = ethToken.amount;
        const erc20Address = erc20Token.address;
        const etherAmountMin = "0";
        const tokenAmountMin = "0";
        const lpTokenAmount = lpAmount;

        console.log({ ethToken, erc20Token, lpAmount })
        // deadline should be passed in minites in calculation
        const _deadlineUnix = getUnixTime(deadline);

        dispatch({ type: START_TRANSACTION })
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

            console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
            if (error) {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'remove', hash: null, status: 'failed' }
              })
            } else {
              dispatch({
                type: UPDATE_TRANSACTION_STATUS,
                payload: { type: 'remove', hash: transactionHash }
              })
            }

          }).on('receipt', async function (receipt) {

            console.log('UPDATE_TRANSACTION_STATUS', receipt)
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'remove', status: 'success', result: { token0: ethToken, token1: erc20Token, lpToken: lpTokenAmount } }
            })

          }).on("error", async function (error) {

            console.log('UPDATE_TRANSACTION_STATUS error', error)
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: 'remove', status: 'failed' }
            })

          });

        console.log(rmLiquidity);
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
    console.log("checking allowance", token);
    // const _tokenContract = token.imported
    //   ? tokenContract(token.address, token.abi, network)
    //   : getTokenContract(network, token.symbol);
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

    console.log("allowance ", tokenAllowance);
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
      // const _tokenContract = token.imported
      //   ? tokenContract(token.address, token.abi, network)
      //   : getTokenContract(network, token.symbol);
      console.log("token", token);
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
      console.log("allowance confirmed ", tokenAllowance);
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
  (token1, token2, pairAddress, account, network) => async (dispatch) => {
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
          payload: { pair: `${token1.symbol}_${token2.symbol}`, status: true },
        });
      } else {
        dispatch({
          type: APPROVE_LP_TOKENS,
          payload: { pair: `${token1.symbol}_${token2.symbol}`, status: false },
        });
      }
      console.log("lp allowance ", lpAllowance);
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
  (balance, token1, token2, pairAddress, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, network);
      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      const lpAllowance = await _pairContract.methods
        .approve(_routerContract._address, balance)
        .send({ from: account });

      dispatch({
        type: APPROVE_LP_TOKENS,
        payload: { pair: `${token1.symbol}_${token2.symbol}`, status: true },
      });
      console.log("allowance confirmed ", lpAllowance);
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

    const currentSupportedTokens =
      network === etheriumNetwork ? tokens : bscTokens;

    const cachedTokens = getCachedTokens();
    const allTokens =
      cachedTokens.length > 0
        ? [...cachedTokens, ...currentSupportedTokens]
        : [...currentSupportedTokens];
    dispatch({
      type: LOAD_TOKEN_LIST,
      payload: allTokens,
    });
  } catch (error) {
    console.log("loadTokens ", error);
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to confirm allowance",
    });
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

    const [tokenInfoData] = await Promise.all([
      // fetchTokenAbi(address),
      fetchTokenInfo(address),
    ]);

    console.log("token info received ", tokenInfoData);
    let tokenInfo = {};
    if (tokenInfoData.status === '0') {
      tokenInfo = {
        tokenName: "Test erc20 token",
        symbol: "TEST"
      }
      // tokenInfo.tokenName = "Test token";
      // tokenInfo.symbol = "TEST";
    } else {
      tokenInfo = tokenInfoData.result[0];
    }

    const tokenObj = {
      name: tokenInfo.tokenName,
      symbol: tokenInfo.symbol,
      address: address,
    };
    cacheImportedToken(tokenObj);
    dispatch({
      type: IMPORT_TOKEN,
      payload: {
        listData: tokenObj,
      },
    });
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
export const getToken1OutAmount = async (token0, token1, network) => {
  try {

    const _routerContract = routerContract(network);

    // calculate price from token0->weth->token path
    const wethAddress = currentConnection === 'testnet' ? WETH_ADDRESS_TESTNET : WETH_ADDRESS_MAINNET;
    const usdtAddress = currentConnection === 'testnet' ? usdtTestnetAddress : usdtMainnetAddress;

    const token0In = token0.amount;

    const _path0 = [token0.address, token1.address]
    const _path1 = [token0.address, wethAddress, token1.address]
    const _path2 = [token0.address, wethAddress, usdtAddress, token1.address];

    const bridgePath = (DECIMAL_6_ADDRESSES.includes(token0.address) || DECIMAL_6_ADDRESSES.includes(token1.address))
      ? _path2 : _path1;

    let amountsOutPair;
    let amountsOutWethBridge;
    let selectedPath = [];
    let resultOut = '0';

    // const pairAddress = await getPairAddress(token0.address, token1.address);

    if ((token0.symbol === ETH || token1.symbol === ETH) || DECIMAL_6_ADDRESSES.includes(token0.address)) {
      console.log('getToken1OutAmount fetching from direct pair', _path0)
      // fetch from pair only
      amountsOutPair = await _routerContract.methods.getAmountsOut(token0In, _path0).call();
      const token1OutPair = new BigNumber(amountsOutPair[1])
      resultOut = DECIMAL_6_ADDRESSES.includes(token1.address) ? fromWei(token1OutPair.toString(), 6) : fromWei(token1OutPair.toString());
      selectedPath = _path0;

    } else {

      [amountsOutPair, amountsOutWethBridge] = await Promise.all([
        _routerContract.methods.getAmountsOut(token0In, _path0).call(),
        _routerContract.methods.getAmountsOut(token0In, bridgePath).call(),
      ])

      console.log('getToken1OutAmount  data ', { amountsOutPair, amountsOutWethBridge })
      const token1OutPair = new BigNumber(amountsOutPair[1])
      const token1OutWethBridge = new BigNumber(amountsOutWethBridge[amountsOutWethBridge.length - 1])

      if (token1OutPair.gt(token1OutWethBridge)) {

        console.log('fetching from direct  pair ', _path0, { token1OutPair: token1OutPair.toString(), token1OutWethBridge: token1OutWethBridge.toString() })

        resultOut = DECIMAL_6_ADDRESSES.includes(token1.address) ? fromWei(token1OutPair.toString(), 6) : fromWei(token1OutPair.toString());
        selectedPath = _path0;

      } else {

        console.log('getToken1OutAmount fetching from eth path ', { _path1, token1OutPair: token1OutPair.toString(), token1OutWethBridge: token1OutWethBridge.toString() })
        resultOut = fromWei(token1OutWethBridge.toString());//DECIMAL_6_ADDRESSES.includes(token1.address) ? fromWei(token1OutWethBridge.toString(), 6) : fromWei(token1OutWethBridge.toString());
        selectedPath = bridgePath;
      }



    }

    return { resultOut, selectedPath }


  } catch (error) {
    console.log('getToken1OutAmount error ', error)
    // dispatch({
    //   type: DEX_ERROR,
    //   payload: "getTokenOutAmount error",
    // });
    return '0'
  }
}


// token0 {input,   }
export const getToken0InAmount = async (token0, token1, network) => {
  try {

    const _routerContract = routerContract(network);
    // calculate price from token0->weth->token path
    const wethAddress = currentConnection === 'testnet' ? WETH_ADDRESS_TESTNET : WETH_ADDRESS_MAINNET;
    const usdtAddress = currentConnection === 'testnet' ? usdtTestnetAddress : usdtMainnetAddress;

    const token1Out = token1.amount;

    const _path0 = [token1.address, token0.address]
    const _path1 = [token1.address, wethAddress, token0.address]
    const _path2 = [token1.address, usdtAddress, wethAddress, token0.address];

    const bridgePath = (DECIMAL_6_ADDRESSES.includes(token0.address) || DECIMAL_6_ADDRESSES.includes(token1.address))
      ? _path2 : _path1;

    let amountsInPair;
    let amountsInWethBridge;

    let selectedPath = [];
    let resultIn = '0';

    if (token0.symbol === ETH || token1.symbol === ETH || DECIMAL_6_ADDRESSES.includes(token0.address)) {
      // fetch from pair only
      amountsInPair = await _routerContract.methods.getAmountsIn(token1Out, _path0.reverse()).call();
      const token0InPair = new BigNumber(amountsInPair[0])

      resultIn = DECIMAL_6_ADDRESSES.includes(token0.address) ? fromWei(token0InPair.toString(), 6) : fromWei(token0InPair.toString());
      selectedPath = _path0;
    } else {

      [amountsInPair, amountsInWethBridge] = await Promise.all([
        _routerContract.methods.getAmountsOut(token1Out, _path0).call(),
        _routerContract.methods.getAmountsOut(token1Out, bridgePath).call(),
      ])

      console.log('getToken1InAmount  fetched ', { amountsInPair, amountsInWethBridge })
      const token0InPair = new BigNumber(amountsInPair[1])
      const token1OutWethBridge = new BigNumber(amountsInWethBridge[amountsInWethBridge.length - 1])

      if (token0InPair.gt(token1OutWethBridge)) {


        resultIn = fromWei(token0InPair.toString())//DECIMAL_6_ADDRESSES.includes(token0.address) ? fromWei(token0InPair.toString(), 6) : fromWei(token0InPair.toString());
        selectedPath = _path0.reverse();

        console.log('token0In fetching from direct pair', { token1Out, resultIn: token0InPair.toString() })

      } else {

        console.log('token0In fetching from bridge')
        resultIn = fromWei(token1OutWethBridge.toString())//DECIMAL_6_ADDRESSES.includes(token0.address) ? fromWei(token1OutWethBridge.toString(), 6) : fromWei(token1OutWethBridge.toString());
        selectedPath = bridgePath.reverse();
      }

    }

    return { resultIn, selectedPath }

  } catch (error) {
    console.log('getToken0InAmount error ', { error, token0, token1 })
    // dispatch({
    //   type: DEX_ERROR,
    //   payload: "getTokenOutAmount error",
    // });
    return { resultIn: '0', selectedPath: [] }
  }
}
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

// load token list to be selected
// pairData = { abi:[], address:"" }
const WEI_UNITS_6 = 1000000;
const WEI_UNITS_12 = 1000000000000;

const considerUsdcDecimals = (tokenAddress, value) => {
  return DECIMAL_6_ADDRESSES.includes(tokenAddress)
    ? new BigNumber(value).multipliedBy(WEI_UNITS_12).toFixed(0).toString() : value
}

const fetchPairData = async (token1, token2, _pairContract, account) => {
  try {

    const [lpBalance, token0Addr, token1Addr, reservesData, totalSupply] =
      await Promise.all([
        _pairContract.methods.balanceOf(account).call(),
        _pairContract.methods.token0().call(),
        _pairContract.methods.token1().call(),
        _pairContract.methods.getReserves().call(),
        _pairContract.methods.totalSupply().call(),
      ]);

    let reserve = {};

    if (token1.address.toLowerCase() === token0Addr.toLowerCase()) {
      reserve[token1.symbol] = considerUsdcDecimals(token1.address, reservesData._reserve0);
      reserve[token2.symbol] = considerUsdcDecimals(token2.address, reservesData._reserve1);
    } else {
      reserve[token1.symbol] = considerUsdcDecimals(token1.address, reservesData._reserve1);
      reserve[token2.symbol] = considerUsdcDecimals(token2.address, reservesData._reserve0);
    }

    return { reserve, lpBalance, totalSupply }

  } catch (error) {
    console.log('fetchPairData exeption ', error)
    return { reserve: '0', lpBalance: '0', totalSupply: '0' }

  }
}

export const getLpBalance =
  (token1, token2, pairAddress, account, network) => async (dispatch) => {
    // console.log("getting balance", { token1, token2 });
    try {
      const _pairContract = pairContract(pairAddress, network) // pairContract2(pairData, network);

      dispatch({
        type: SHOW_DEX_LOADING,
      });

      const { reserve, totalSupply, lpBalance } = await fetchPairData(token1, token2, _pairContract, account);

      dispatch({
        type: SET_POOL_RESERVES,
        payload: reserve,
      });

      // formatting fix for usdc
      const _lpBalance = (DECIMAL_6_ADDRESSES.includes(token1.address) || DECIMAL_6_ADDRESSES.includes(token2.address))
        ? new BigNumber(lpBalance).multipliedBy(WEI_UNITS_6).toFixed(0).toString() : lpBalance

      const _totalSupply = (DECIMAL_6_ADDRESSES.includes(token1.address) || DECIMAL_6_ADDRESSES.includes(token2.address))
        ? new BigNumber(totalSupply).multipliedBy(WEI_UNITS_6).toFixed(0).toString() : totalSupply

      dispatch({
        type: GET_POOL_SHARE,
        payload: getPercentage(_lpBalance, _totalSupply),
      });

      dispatch({
        type: SET_LP_BALANCE,
        payload: {
          pair: `${token1.symbol}_${token2.symbol}`,
          amount: _lpBalance,
        },
      });
      console.log("lpBalance ", { lpBalance, _lpBalance });
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
