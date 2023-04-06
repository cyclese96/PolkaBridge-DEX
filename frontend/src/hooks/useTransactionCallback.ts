import { UPDATE_TRANSACTION_STATUS } from "actions/types";
import { swapFnConstants, TransactionStatus } from "../constants/index";
import { ChainId, Token } from "polkabridge-sdk";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useActiveWeb3React from "./useActiveWeb3React";
import useBlockNumber, { useFastForwardBlockNumber } from "./useBlockNumber";
import { useFarmContract, useRouterContract } from "./useContract";
import { getUnixTime, toWei } from "../utils/helper";
import { NATIVE_TOKEN } from "connection/chains";

export function useTransactionCallback(): {
  swapTokens: (
    token0Amount: String,
    token1Amount: String,
    deadline: Number,
    currentSwapFn: String,
    currenSwapPath: Array<String>,
    account: String,
    chainId: Number
  ) => Promise<void>;
  addLiquidity: (
    token0Amount: String,
    token1Amount: String,
    token0: Token,
    token1: Token,
    deadline: Number,
    account: String,
    chainId: ChainId
  ) => Promise<void>;
  removeLiquidity: (
    lpAmount: String,
    token0: Token,
    token1: Token,
    deadline: Number,
    account: String,
    chainId: ChainId
  ) => Promise<void>;
  stakeLpTokens: (
    lpAmount: String,
    pid: Number,
    account: String,
    chainId: ChainId
  ) => Promise<void>;
  unstakeLpTokens: (
    lpAmount: String,
    pid: Number,
    account: String,
    chainId: ChainId
  ) => Promise<void>;
  harvest: (pid: Number, account: String, chainId: ChainId) => Promise<void>;
  resetTrxState: () => void;
} {
  const { provider } = useActiveWeb3React();
  const routerContract = useRouterContract();
  const farmContract = useFarmContract();

  const blockNumber = useBlockNumber();
  const fastFarwardBlockNumber = useFastForwardBlockNumber();

  const dispatch = useDispatch();

  const transaction = useSelector((state: any) => state?.dex?.transaction);

  const swapTokens = useCallback(
    async (
      token0Amount: String,
      token1Amount: String,
      deadline: Number,
      currentSwapFn: String,
      currenSwapPath: Array<String>,
      account: String,
      chainId: Number
    ) => {
      try {
        if (
          !deadline ||
          !currentSwapFn ||
          !currenSwapPath ||
          !chainId ||
          !account ||
          !routerContract ||
          !token0Amount ||
          !token1Amount
        ) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "swap",
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          console.log("swap tokens invalid params ", {
            deadline,
            currentSwapFn,
            currenSwapPath,
            chainId,
            account,
            routerContract,
            token0Amount,
            token1Amount,
          });
          return;
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "swap",
            status: TransactionStatus.WAITING,
          },
        });

        const token0In = token0Amount;

        const token1Min = 0; //token1.min;

        const path = currenSwapPath;
        const toAddress = account;
        const _deadlineUnix = getUnixTime(deadline);

        let swapRes;
        if (currentSwapFn === swapFnConstants.swapExactETHForTokens) {
          //case 1 swapExactETHForTokens
          swapRes = routerContract.swapExactETHForTokens(
            token1Min,
            path,
            toAddress,
            _deadlineUnix,
            { from: account, value: token0In }
          );
        } else if (currentSwapFn === swapFnConstants.swapETHforExactTokens) {
          // case 2 swapETHforExactTokens
          swapRes = routerContract.swapExactETHForTokens(
            token1Min,
            path,
            toAddress,
            _deadlineUnix,
            { from: account, value: token0In }
          );
        } else if (currentSwapFn === swapFnConstants.swapExactTokensForETH) {
          // case 3 swapExactTokensForETH

          swapRes = routerContract.swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix,
            { from: account }
          );
        } else if (currentSwapFn === swapFnConstants.swapTokensForExactETH) {
          // case 4  swapTokensForExactETH

          swapRes = routerContract.swapExactTokensForETH(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix,
            { from: account }
          );
        } else if (currentSwapFn === swapFnConstants.swapExactTokensForTokens) {
          // case 5  swapExactTokensForTokens

          swapRes = routerContract.swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix,
            { from: account }
          );
        } else {
          // case 6 swapTokensForExactTokens

          swapRes = routerContract.swapExactTokensForTokens(
            token0In,
            token1Min,
            path,
            toAddress,
            _deadlineUnix,
            { from: account }
          );
        }

        const trx = await swapRes;
        console.log("trade test trx res ", { trx });
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "swap",
            hash: trx?.hash,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "swap",
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });

        console.log("trade test  swap tokens  trx error ", { error });
      }
    },
    [routerContract, dispatch]
  );

  const addLiquidity = useCallback(
    async (
      token0Amount: String,
      token1Amount: String,
      token0: Token,
      token1: Token,
      deadline: Number,
      account: String,
      chainId: ChainId
    ) => {
      try {
        if (
          !deadline ||
          !chainId ||
          !account ||
          !routerContract ||
          !token0Amount ||
          !token1Amount ||
          !token0 ||
          !token1
        ) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "add",
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          console.log("add liquidity invalid params ", {
            deadline,
            chainId,
            account,
            routerContract,
            token0Amount,
            token1Amount,
            token0,
            token1,
          });
          return;
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "add",
            status: TransactionStatus.WAITING,
          },
        });

        const token0AmountDesired = token0Amount;
        const token0AmountMin = "0";
        const token1AmountDesired = token1Amount;
        const token1AmountMin = "0";

        // deadline should be passed in minites in calculation
        const _deadlineUnix = getUnixTime(deadline);

        let addRes;
        if (token0?.symbol === NATIVE_TOKEN?.[chainId]) {
          // handle add liquidity with eth pair
          const etherAmount = token0Amount;
          const etherAmountMin = "0";
          const tokenAmountDesired = token1Amount;
          const tokenAmountMin = "0";
          const tokenAddress = token1.address;

          console.log("trade test running add liq eth", {
            tokenAddress,
            tokenAmountDesired,
            tokenAmountMin,
            etherAmountMin,
            account,
            _deadlineUnix,
          });
          addRes = await routerContract.addLiquidityETH(
            tokenAddress,
            tokenAmountDesired,
            tokenAmountMin,
            etherAmountMin,
            account,
            _deadlineUnix,
            { from: account, value: toWei(etherAmount) }
          );
        } else {
          console.log("trade test running add liq tokens");
          addRes = await routerContract.addLiquidity(
            token0?.address,
            token1?.address,
            token0AmountDesired,
            token1AmountDesired,
            token0AmountMin,
            token1AmountMin,
            account,
            _deadlineUnix,
            { from: account }
          );
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "add",
            hash: addRes?.hash,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "add",
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });

        console.log("Add liquidity error ", { error });
      }
    },
    [routerContract, dispatch]
  );

  const removeLiquidity = useCallback(
    async (
      lpAmount: String,
      token0: Token,
      token1: Token,
      deadline: Number,
      account: String,
      chainId: ChainId
    ) => {
      try {
        if (
          !deadline ||
          !chainId ||
          !account ||
          !routerContract ||
          !lpAmount ||
          !token0 ||
          !token1
        ) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: "remove",
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          console.log("remove liquidity invalid params ", {
            deadline,
            chainId,
            account,
            routerContract,
            lpAmount,
            token0,
            token1,
          });
          return;
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "remove",
            status: TransactionStatus.WAITING,
          },
        });

        const token0AmountMin = "0";
        const token1AmountMin = "0";
        // deadline should be passed in minites in calculation
        const _deadlineUnix = getUnixTime(deadline);

        let addRes;
        if (token0?.symbol === NATIVE_TOKEN?.[chainId]) {
          // handle remove liquidity with eth pair

          const etherAmountMin = "0";
          const tokenAmountMin = "0";
          const tokenAddress = token1.address;

          addRes = await routerContract.removeLiquidityETH(
            tokenAddress,
            lpAmount,
            tokenAmountMin,
            etherAmountMin,
            account,
            _deadlineUnix,
            { from: account }
          );
        } else {
          addRes = await routerContract.removeLiquidity(
            token0.address,
            token1.address,
            lpAmount,
            token0AmountMin,
            token1AmountMin,
            account,
            _deadlineUnix,
            { from: account }
          );
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "remove",
            hash: addRes?.hash,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: "remove",
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });

        console.log("remove liq trx error ", { error });
      }
    },
    [routerContract, dispatch]
  );

  const resetTrxState = useCallback(() => {
    dispatch({
      type: UPDATE_TRANSACTION_STATUS,
      payload: { type: null, hash: null, status: null },
    });
  }, [dispatch]);

  const stakeLpTokens = useCallback(
    async (
      lpAmount: String,
      pid: Number,
      account: String,
      chainId: ChainId
    ) => {
      try {
        if (!lpAmount || !pid || !farmContract || !account || !chainId) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: `stake_farm_${pid}`,
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          console.log("stake lp error invalid params ", {
            lpAmount,
            pid,
            farmContract,
            account,
            chainId,
          });
          return;
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `stake_farm_${pid}`,
            status: TransactionStatus.WAITING,
          },
        });

        const gasLimit = await farmContract.estimateGas.deposit(pid, lpAmount);
        const gasPrice = await provider?.getGasPrice();

        const trxRes: any = await farmContract.deposit(pid, lpAmount, {
          from: account,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        });

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `stake_farm_${pid}`,
            hash: trxRes?.hash,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `stake_farm_${pid}`,
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });

        console.log("stake farm  trx error ", { error });
      }
    },
    [farmContract, provider, dispatch]
  );

  const unstakeLpTokens = useCallback(
    async (
      lpAmount: String,
      pid: Number,
      account: String,
      chainId: ChainId
    ) => {
      try {
        if (!lpAmount || !pid || !farmContract || !account || !chainId) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: `unstake_farm_${pid}`,
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          console.log("unstake lp error invalid params ", {
            lpAmount,
            pid,
            farmContract,
            account,
            chainId,
          });
          return;
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `unstake_farm_${pid}`,
            status: TransactionStatus.WAITING,
          },
        });

        const gasLimit = await farmContract.estimateGas.withdraw(pid, lpAmount);
        const gasPrice = await provider?.getGasPrice();

        const trxRes: any = await farmContract.withdraw(pid, lpAmount, {
          from: account,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        });

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `unstake_farm_${pid}`,
            hash: trxRes?.hash,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `unstake_farm_${pid}`,
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });

        console.log("unstake lp  trx exeption ", { error });
      }
    },
    [farmContract, provider, dispatch]
  );

  const harvest = useCallback(
    async (pid: Number, account: String, chainId: ChainId) => {
      try {
        if (!pid || !farmContract || !account || !chainId || !provider) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: `harvest_farm_${pid}`,
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          console.log("harvest error invalid prarams ", {
            pid,
            farmContract,
            account,
            chainId,
            provider,
          });
          return;
        }

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `harvest_farm_${pid}`,
            status: TransactionStatus.WAITING,
          },
        });

        const gasLimit = await farmContract.estimateGas.harvest(pid);
        const gasPrice = await provider?.getGasPrice();

        const trxRes: any = await farmContract.harvest(pid, {
          from: account,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        });

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `harvest_farm_${pid}`,
            hash: trxRes?.hash,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: `harvest_farm_${pid}`,
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });

        console.log("harvest error exeption ", { error });
      }
    },
    [farmContract, provider, dispatch]
  );

  // check and update pending withdraw transactions

  useEffect(() => {
    if (!transaction?.hash) {
      return;
    }
    console.log("trade test status updating ", transaction);
    if (
      transaction?.status === TransactionStatus.COMPLETED ||
      transaction?.status === TransactionStatus.FAILED ||
      transaction?.type?.includes("allowance") // watch other than allowance transactions
    ) {
      return;
    }

    provider
      ?.getTransactionReceipt(transaction?.hash)
      .then((res) => {
        console.log("trade test ", { res });
        if (res && res?.blockHash && res?.blockNumber && res?.status === 1) {
          fastFarwardBlockNumber(res?.blockNumber);
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              ...transaction,
              status: TransactionStatus.COMPLETED,
            },
          });
        } else if (res && res?.status !== 1) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              ...transaction,
              status: TransactionStatus.FAILED,
            },
          });
        }
      })
      .catch((err) => {
        console.log("transaction failed ", err);
        console.log("fetch latest init fetch action from deposit error");

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            ...transaction,
            hash: null,
            status: TransactionStatus.FAILED,
          },
        });
      });
  }, [blockNumber, transaction, provider, fastFarwardBlockNumber, dispatch]);

  return {
    swapTokens: swapTokens,
    addLiquidity: addLiquidity,
    removeLiquidity: removeLiquidity,
    resetTrxState: resetTrxState,
    stakeLpTokens: stakeLpTokens,
    unstakeLpTokens: unstakeLpTokens,
    harvest: harvest,
  };
}
