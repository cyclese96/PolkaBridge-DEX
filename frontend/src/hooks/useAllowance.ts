import { Token } from "polkabridge-sdk";
import { useCallback, useEffect, useMemo } from "react";
import { useTokenContract } from "hooks/useContract";
import { useSingleCallResult } from "state/multicall/hooks";
import useActiveWeb3React from "./useActiveWeb3React";
import { toWei } from "utils/helper";
import { UPDATE_TRANSACTION_STATUS } from "actions/types";
import { TransactionStatus } from "../constants/index";
import { useDispatch, useSelector } from "react-redux";
import useBlockNumber, { useFastForwardBlockNumber } from "./useBlockNumber";
import BigNumber from "bignumber.js";
import { NATIVE_TOKEN } from "../connection/chains";

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): {
  allowance: Boolean;
  confirmAllowance: (tokenAmount?: String) => Promise<void>;
  resetTrxState: () => void;
} {
  const contract = useTokenContract(token?.address);
  const { provider, chainId } = useActiveWeb3React();
  const dispatch = useDispatch();
  const transaction = useSelector((state: any) => state?.dex?.transaction);
  const fastFarwardBlockNumber = useFastForwardBlockNumber();
  const blockNumber = useBlockNumber();

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult(contract, "allowance", inputs).result;

  const tokenAllowance = useMemo(() => {
    if (!chainId) {
      return false;
    }

    if (token?.symbol === NATIVE_TOKEN?.[chainId]) {
      return true;
    } else {
      return token && allowance
        ? new BigNumber(allowance?.toString()).gt(0)
          ? true
          : false
        : false;
    }
  }, [token, allowance, chainId]);

  // console.log("allowance test token allowance ", {
  //   token,
  //   spender,
  //   owner,
  //   tokenAllowance,
  //   allowance: allowance?.toString(),
  // });
  const confirmAllowance = useCallback(
    async (tokenAmount?: String, type: String = "token_approve") => {
      try {
        if (!tokenAmount || !contract) {
          dispatch({
            type: UPDATE_TRANSACTION_STATUS,
            payload: {
              type: type,
              hash: null,
              status: TransactionStatus.FAILED,
            },
          });
          return;
        }

        const _amount = toWei(tokenAmount, token?.decimals);
        // console.log("allowance test", { _amount, spender, contract });
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: type,
            status: TransactionStatus.WAITING,
          },
        });
        const gasLimit = await contract.estimateGas.approve(spender, _amount);
        console.log("estimate gas limit ", gasLimit?.toString());
        const trx = await contract?.approve(spender, _amount);

        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            hash: trx?.hash,
            type: type,
            status: TransactionStatus.PENDING,
          },
        });
      } catch (error) {
        console.log("allowance test  ", error);
        dispatch({
          type: UPDATE_TRANSACTION_STATUS,
          payload: {
            type: type,
            status: TransactionStatus.FAILED,
          },
        });
      }
    },
    [contract]
  );

  const resetTrxState = useCallback(() => {
    dispatch({
      type: UPDATE_TRANSACTION_STATUS,
      payload: { type: null, hash: null, status: null },
    });
  }, [dispatch]);

  // check and update pending withdraw transactions

  useEffect(() => {
    if (!transaction?.hash) {
      return;
    }

    if (
      transaction?.status === TransactionStatus.COMPLETED ||
      transaction?.status === TransactionStatus.FAILED ||
      !transaction?.type?.includes("allowance") // watch only allowance transactions
    ) {
      return;
    }

    provider
      ?.getTransactionReceipt(transaction?.hash)
      .then((res) => {
        console.log("allowance trade test ", { res });
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
  }, [blockNumber, transaction]);

  return {
    allowance: tokenAllowance,
    confirmAllowance: confirmAllowance,
    resetTrxState,
  };
}
