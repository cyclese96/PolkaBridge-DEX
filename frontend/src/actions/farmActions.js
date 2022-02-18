import {
  APPROVE_LP_FARM,
  SHOW_FARM_LOADING,
  HIDE_FARM_LOADING,
  STAKE_LP_TOKENS,
  GET_LP_BALANCE_FARM,
  UPDATE_TRANSACTION_STATUS,
  START_TRANSACTION,
  GET_FARM_POOL,
} from "./types";
import { farmContract, pairContract } from "../contracts/connections";
import { currentConnection, farmAddresses, tokenAddresses } from "../constants";
import BigNumber from "bignumber.js";
import { fromWei } from "../utils/helper";

const getLoadingObject = (_key, flag) => {
  const obj = {};
  obj[_key] = flag;
  return obj;
};

export const checkLpFarmAllowance =
  (pairAddress, account, network) => async (dispatch) => {
    try {
      const _pairContract = pairContract(pairAddress, network);
      const _farmAddress = farmAddresses?.[network];

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      const lpAllowance = await _pairContract.methods
        .allowance(account, _farmAddress)
        .call();

      const apprvedObj = {};
      if (new BigNumber(lpAllowance).gt(0)) {
        apprvedObj[pairAddress] = true;
      } else {
        apprvedObj[pairAddress] = false;
      }

      dispatch({
        type: APPROVE_LP_FARM,
        payload: apprvedObj,
      });
    } catch (error) {
      console.log("farmTest checkLpFarmAllowance ", error);
    }

    dispatch({
      type: HIDE_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };

export const confirmLpFarmAllowance =
  (allowanceAmount, pairAddress, account, network) => async (dispatch) => {
    try {
      // const _testPbrToken = tokenAddresses?.ethereum.PBR.testnet;

      const _pairContract = pairContract(pairAddress, network);
      const _farmAddress = farmAddresses?.[network];

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      dispatch({ type: START_TRANSACTION });

      await _pairContract.methods
        .approve(_farmAddress, allowanceAmount)
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "approve", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "approve", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "approve", status: "success" },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "approve", status: "failed" },
          });
        });

      const apprvedObj = {};
      apprvedObj[pairAddress] = true;
      dispatch({
        type: APPROVE_LP_FARM,
        payload: apprvedObj,
      });
    } catch (error) {
      console.log("confirmLpFarmAllowance ", error);
    }
    dispatch({
      type: HIDE_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };

export const stakeLpTokens =
  (lpAmount, pairAddress, pid, account, network) => async (dispatch) => {
    try {
      const _farmContract = farmContract(network);

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      dispatch({ type: START_TRANSACTION });

      await _farmContract.methods
        .deposit(pid, lpAmount)
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "stake", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "stake", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "stake", status: "success" },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "stake", status: "failed" },
          });
        });

      dispatch({
        type: STAKE_LP_TOKENS,
        payload: lpAmount,
      });
    } catch (error) {
      console.log("stakeLpTokens", error);
    }
    dispatch({
      type: HIDE_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };

export const unstakeLpTokens =
  (lpAmount, pairAddress, pid, account, network) => async (dispatch) => {
    try {
      const _farmContract = farmContract(network);

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      dispatch({ type: START_TRANSACTION });

      await _farmContract.methods
        .withdraw(pid, lpAmount)
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "stake", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "stake", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "stake", status: "success" },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "stake", status: "failed" },
          });
        });

      dispatch({
        type: STAKE_LP_TOKENS,
        payload: lpAmount,
      });
    } catch (error) {
      console.log("unstakeLpTokens", error);
    }

    dispatch({
      type: SHOW_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };

export const harvestRewards =
  (pairAddress, pid, account, network) => async (dispatch) => {
    try {
      const _farmContract = farmContract(network);

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      dispatch({ type: START_TRANSACTION });

      await _farmContract.methods
        .harvest(pid)
        .send({ from: account }, function (error, transactionHash) {
          if (error) {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "stake", hash: null, status: "failed" },
            });
          } else {
            dispatch({
              type: UPDATE_TRANSACTION_STATUS,
              payload: { type: "stake", hash: transactionHash },
            });
          }
        })
        .on("receipt", async function (receipt) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "stake", status: "success" },
          });
        })
        .on("error", async function (error) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: { type: "stake", status: "failed" },
          });
        });
    } catch (error) {
      console.log("harvestRewards ", error);
    }
    dispatch({
      type: HIDE_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };

export const getFarmInfo =
  (pairAddress, pid, account, network) => async (dispatch) => {
    try {
      const _farmContract = farmContract(network);

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      const [poolInfo, pendingPbr, userInfo, totalAllocPoint] =
        await Promise.all([
          _farmContract.methods.poolInfo(pid).call(),
          _farmContract.methods.pendingPBR(pid, account).call(),
          _farmContract.methods.userInfo(pid, account).call(),
          _farmContract.methods.totalAllocPoint().call(),
        ]);

      const farmPoolObj = {};
      farmPoolObj[pairAddress] = {
        pendingPbr: pendingPbr,
        stakeData: userInfo,
        poolWeight: new BigNumber(poolInfo?.allocPoint)
          .div(totalAllocPoint)
          .toString(),
        lockedLp: poolInfo?.lpAmount,
      };

      dispatch({
        type: GET_FARM_POOL,
        payload: farmPoolObj,
      });
    } catch (error) {
      console.log("farmTest: getFarmInfo", {
        error,
        pid,
        account,
        pairAddress,
      });
    }

    dispatch({
      type: SHOW_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };

export const getLpBalanceFarm =
  (pairAddress, account, network) => async (dispatch) => {
    try {
      if (!pairAddress || !network) {
        return;
      }

      const _pairContract = pairContract(pairAddress, network);

      dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, true),
      });

      const [lpBalance, token0Addr, token1Addr, reservesData, totalSupply] =
        await Promise.all([
          _pairContract.methods.balanceOf(account).call(),
          _pairContract.methods.token0().call(),
          _pairContract.methods.token1().call(),
          _pairContract.methods.getReserves().call(),
          _pairContract.methods.totalSupply().call(),
        ]);

      const reserve = {};
      reserve[token0Addr] = reservesData._reserve0;
      reserve[token1Addr] = reservesData._reserve1;

      //calculating total liquidity usd value
      const ethAddress =
        currentConnection === "mainnet"
          ? tokenAddresses.ethereum.ETH.mainnet.toLowerCase()
          : tokenAddresses.ethereum.ETH.testnet.toLowerCase();
      let valueOfBaseTokenInFarm = 0;
      // base in this calculation is eth token
      if (token0Addr.toLowerCase() === ethAddress) {
        valueOfBaseTokenInFarm = reservesData._reserve0;
      } else {
        valueOfBaseTokenInFarm = reservesData._reserve1;
      }

      const overallValueOfAllTokensInFarm = new BigNumber(
        valueOfBaseTokenInFarm
      ).times(2);

      const lpTokenPrice = overallValueOfAllTokensInFarm.div(totalSupply);

      const balObject = {};
      balObject[pairAddress] = {
        lpBalance,
        poolLpTokens: new BigNumber(fromWei(totalSupply))
          .times(lpTokenPrice)
          .toFixed(0)
          .toString(),
      };

      dispatch({
        type: GET_LP_BALANCE_FARM,
        payload: balObject,
      });
    } catch (error) {
      console.log("getLpBalanceFarm ", error);
    }

    dispatch({
      type: SHOW_FARM_LOADING,
      payload: getLoadingObject(pairAddress, false),
    });
  };
