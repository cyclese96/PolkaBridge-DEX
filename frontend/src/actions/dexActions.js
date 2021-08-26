import BigNumber from "bignumber.js";
import {
  ETH,
  supportedTokens,
  tokens,
  WETH_ADDRESS_TESTNET,
} from "../constants";
import {
  pairContract,
  routerContract,
  tokenContract,
} from "../contracts/connections";
import {
  toWei,
  getTokenContract,
  getUnixTime,
  getPercentage,
  fetchTokenAbi,
  fetchTokenInfo,
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
  SET_LP_BALANCE,
  SET_POOL_RESERVES,
  SET_TOKEN0_PRICE,
  SET_TOKEN1_PRICE,
  SHOW_DEX_LOADING,
  SHOW_LOADING,
} from "./types";

// Buy trade action
// token0 will be eth and token1 could be any erc20 token
export const swapExactEthForTokens =
  (token0, token1, deadline, account, network) => async (dispatch) => {
    try {
      // const _pairContract = pairContract(network);
      const _routerContract = routerContract(network);
      const _tokenContract = getTokenContract(network, token1.symbol);

      const fromTokenName = token0.name;
      const fromTokenAmount = toWei(token0.amount);

      const toTokenName = token1.name; // erc20 token name
      const toTokenAmount = toWei(token1.outAmount);
      const tokenAddress = token1.address;
      const path = [tokenAddress];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);
      dispatch({
        type: SHOW_LOADING,
      });
      const swapRes = await _routerContract.methods
        .swapExactETHForTokens(toTokenAmount, path, toAddress, _deadlineUnix)
        .send({ from: account });

      console.log({ token0, token1 });
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

// Sell trade action
// token0 will be erc20 token user want to sell and token1 is eth
export const swapEthForExactTokens =
  (token0, token1, deadline, account, network) => async (dispatch) => {
    try {
      // const _pairContract = pairContract(network);
      const _routerContract = routerContract(network);
      const _tokenContract = getTokenContract(network, token1.symbol);

      const fromTokenName = token0.name; // erc20 token name
      const fromTokenAmount = toWei(token0.outAmount);
      const tokenAddress = _tokenContract._address;

      // const maxEthAmount = toWei(token0.amount);

      const path = [tokenAddress];
      const toAddress = account;
      const _deadlineUnix = getUnixTime(deadline);

      dispatch({
        type: SHOW_LOADING,
      });
      const swapRes = await _routerContract.methods
        .swapETHForExactTokens(fromTokenAmount, path, toAddress, _deadlineUnix)
        .send({ from: account });

      console.log({ token0, token1 });
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

export const getTokenPrice = (tokenNumber, network) => async (dispatch) => {
  try {
    const _pairContract = pairContract(network);

    const price =
      tokenNumber === 0
        ? await _pairContract.methods.price0CumulativeLast().call()
        : await _pairContract.methods.price1CumulativeLast().call();

    console.log({ tokenNumber, price });
    dispatch({
      type: tokenNumber === 0 ? SET_TOKEN0_PRICE : SET_TOKEN1_PRICE,
      payload: price,
    });
  } catch (error) {
    console.log("getTokenPrice:  ", error);
    dispatch({
      type: DEX_ERROR,
      payload: "Failed to get token price",
    });
  }
};

//
export const getAmountsOut =
  (tokenAddress, inputTokens, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(network);

      const amountIn = toWei(inputTokens);
      const path = [tokenAddress, WETH_ADDRESS_TESTNET];
      const amounts = await _pairContract.methods
        .getAmountsOut(amountIn, path)
        .call();

      console.log(amounts);
    } catch (error) {
      console.log("getTokenPrice:  ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to get token price",
      });
    }
  };

//
export const getPoolShare =
  (token0Symbol, token1Symbol, token0Input, token1Input, network) =>
  async (dispatch) => {
    try {
      //Load pair contract of selected token pair
      const _pairContract = pairContract(token0Symbol, token1Symbol, network);

      const erc20TokenSymbol =
        token0Symbol === ETH ? token1Symbol : token0Symbol;
      const erc20InputValue = token0Symbol === ETH ? token1Input : token0Input;
      const _erc20Contract = getTokenContract(network, erc20TokenSymbol);

      const inputTokenValue = toWei(erc20InputValue);

      if (!_pairContract) {
        dispatch({
          type: GET_POOL_SHARE,
          payload: getPercentage(inputTokenValue, "0"),
        });
        return;
      }

      const [token0Address, token1Address, reservesData] = await Promise.all([
        _pairContract.methods.token0().call(),
        _pairContract.methods.token1().call(),
        _pairContract.methods.getReserves().call(),
      ]);
      // console.log({ token0Address, token1Address, reservesData });
      let erc20Reserves = 0;
      if (_erc20Contract._address === token0Address) {
        erc20Reserves = reservesData._reserve0;
      } else {
        erc20Reserves = reservesData._reserve1;
      }

      const reserveTokenValue = erc20Reserves ? erc20Reserves : "0";

      dispatch({
        type: GET_POOL_SHARE,
        payload: getPercentage(inputTokenValue, reserveTokenValue),
      });
    } catch (error) {
      console.log("getTokenPrice:  ", error);
      dispatch({
        type: DEX_ERROR,
        payload: "Failed to get token price",
      });
    }
  };

//token0: { amount: "", address: "", desired:"", min:"" }
//token1 { amount: "", address: "", desired:"", min:"" }
export const addLiquidityEth =
  (ethToken, erc20Token, account, deadline, network) => async (dispatch) => {
    try {
      const _tokenContract = getTokenContract(network, erc20Token.symbol);
      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_LOADING,
      });
      //input params
      const etherAmount = ethToken.amount;
      const etherAmountMin = ethToken.min;
      const tokenAmountDesired = erc20Token.amount;
      const tokenAmountMin = erc20Token.min;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);
      console.log({
        contAddres: _tokenContract._address,
        tokenAmountDesired,
        tokenAmountMin,
        etherAmountMin,
        account,
        _deadlineUnix,
      });
      const liquidity = await _routerContract.methods
        .addLiquidityETH(
          _tokenContract._address,
          tokenAmountDesired,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account, value: toWei(ethToken.amount) });

      console.log(liquidity);
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
export const removeLiquidityEth =
  (ethToken, erc20Token, account, lpAmount, deadline, network) =>
  async (dispatch) => {
    try {
      const _tokenContract = getTokenContract(network, erc20Token.symbol);
      const _routerContract = routerContract(network);

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      //input params
      // const etherAmount = ethToken.amount;
      const etherAmountMin = 0;
      const tokenAmountMin = 0;
      const lpTokenAmount = lpAmount;

      // deadline should be passed in minites in calculation
      const _deadlineUnix = getUnixTime(deadline);

      const rmLiquidity = await _routerContract.methods
        .removeLiquidityETH(
          _tokenContract._address,
          lpTokenAmount,
          tokenAmountMin,
          etherAmountMin,
          account,
          _deadlineUnix
        )
        .send({ from: account });

      console.log(rmLiquidity);
    } catch (error) {
      console.log("removeLiquidityEth: ", error);
    }

    dispatch({
      type: HIDE_DEX_LOADING,
    });
  };

export const checkAllowance = (token, account, network) => async (dispatch) => {
  try {
    console.log("checking allowance");
    const _tokenContract = token.imported
      ? tokenContract(token.address, token.abi, network)
      : getTokenContract(network, token.symbol);
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
      const _tokenContract = token.imported
        ? tokenContract(token.address, token.abi, network)
        : getTokenContract(network, token.symbol);
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
  (token1, token2, account, network) => async (dispatch) => {
    try {
      // console.log("checking allowance");
      const _pairContract = pairContract(token1.symbol, token2.symbol, network);
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
  (balance, token1, token2, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(token1.symbol, token2.symbol, network);
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

    // todo:
    // check imported tokens from local storage
    const currentSupportedTokens = supportedTokens[network];

    dispatch({
      type: LOAD_TOKEN_LIST,
      payload: tokens.filter((item) =>
        currentSupportedTokens.includes(item.symbol)
      ),
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

    const [abiData, tokenInfoData] = await Promise.all([
      fetchTokenAbi(address),
      fetchTokenInfo(address),
    ]);

    const tokenInfo = tokenInfoData.result[0];
    const contractABI = JSON.parse(abiData.result);
    const _importedData = {
      name: tokenInfo.tokenName,
      symbol: tokenInfo.symbol,
      address: address,
      abi: contractABI,
      imported: true,
    };

    dispatch({
      type: IMPORT_TOKEN,
      payload: {
        importedData: _importedData,
        listData: {
          name: tokenInfo.tokenName,
          symbol: tokenInfo.symbol,
          address: address,
          abi: contractABI,
          imported: true,
        },
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

// load token list to be selected
export const getLpBalance =
  (token1, token2, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(token1.symbol, token2.symbol, network);

      dispatch({
        type: SHOW_DEX_LOADING,
      });
      const [lpBalance, token0Addr, token1Addr, reservesData, totalSupply] =
        await Promise.all([
          _pairContract.methods.balanceOf(account).call(),
          _pairContract.methods.token0().call(),
          _pairContract.methods.token1().call(),
          _pairContract.methods.getReserves().call(),
          _pairContract.methods.totalSupply().call(),
        ]);

      console.log({
        lpBalance,
        token0Addr,
        token1Addr,
        reservesData,
        totalSupply,
      });
      // let erc20Reserves = 0;
      console.log("token1 ", token1.address);
      console.log("token2 ", token2._address);
      let reserve = {};
      if (token1.address === token0Addr) {
        console.log("first token is ", token1.symbol);
        reserve[token1.symbol] = reservesData._reserve0;
        reserve[token2.symbol] = reservesData._reserve1;
        // reserve["TOTAL"] = totalSupply;
        // erc20Reserves = reservesData._reserve0;
      } else {
        console.log("first token is ", token2.symbol);
        reserve[token1.symbol] = reservesData._reserve1;
        reserve[token2.symbol] = reservesData._reserve0;
        // reserve["TOTAL"] = totalSupply;
      }

      dispatch({
        type: SET_POOL_RESERVES,
        payload: reserve,
      });

      dispatch({
        type: GET_POOL_SHARE,
        payload: getPercentage(lpBalance, totalSupply),
      });

      dispatch({
        type: SET_LP_BALANCE,
        payload: {
          pair: `${token1.symbol}_${token2.symbol}`,
          amount: lpBalance,
        },
      });
      console.log("lpBalance ", lpBalance);
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
