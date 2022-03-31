import { TokenAmount, Pair, Currency, Token } from "polkabridge-sdk";
import { useMemo } from "react";
import { Interface } from "@ethersproject/abi";
// import { wrappedCurrency } from "./wrappedCurrency";

import { useMultipleContractSingleData } from "../state/multicall/hooks";
import IUniswapV2PairABI from "../contracts/abi/pair.json";
import useActiveWeb3React from "../lib/useActiveWeb3React";

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  currencies: [Token | undefined, Token | undefined][]
): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React();

  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA, currencyB]),
    [chainId, currencies]
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        try {
          return tokenA && tokenB && !tokenA.equals(tokenB)
            ? Pair.getAddress(tokenA, tokenB, tokenA.chainId)
            : undefined;
        } catch (error) {
          return undefined;
        }
      }),
    [tokens]
  );

  const results = useMultipleContractSingleData(
    pairAddresses,
    PAIR_INTERFACE,
    "getReserves"
  );

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB))
        return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { _reserve0, _reserve1 } = reserves;
      if (!_reserve0 || !_reserve1) return [PairState.NOT_EXISTS, null];
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          new TokenAmount(token0, _reserve0.toString()),
          new TokenAmount(token1, _reserve1.toString()),
          chainId || 1
        ),
      ];
    });
  }, [results, tokens, chainId]);
}

export function usePair(
  tokenA?: Token,
  tokenB?: Token
): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
