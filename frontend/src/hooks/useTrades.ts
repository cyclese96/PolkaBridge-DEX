import {
  Currency,
  CurrencyAmount,
  ETHER,
  Pair,
  Token,
  Trade,
  WETH,
} from "polkabridge-sdk";
import flatMap from "lodash.flatmap";
import { useMemo } from "react";

// import { GlobalData } from '../constants';
import { PairState, usePairs } from "../data/Reserves";
// import { wrappedCurrency } from '../utils/wrappedCurrency';
import { ETH, SWAP_BASES } from "../constants";
import { wrappedCurrency, wrappedCurrencyAmount } from "./wrappedCurrency";
import tokenListLocal from "../tokenList/tokenListTest.json";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { getAddress } from "@ethersproject/address";

function getTokenWithSymbol(symbol: String) {
  const tokenItem = tokenListLocal.ethereum.find(
    (_token) => _token.symbol === symbol
  );
  // const tokenItem = tokenListLocal.ethereum[tokenIndex];

  if (!tokenItem) {
    console.log("test  token not found", {
      symbol,
      keys: tokenItem,
    });
    return WETH[4];
  }
  if (symbol === ETH) {
    return WETH[4];
  }

  const _token = new Token(
    4,
    getAddress(tokenItem.address),
    tokenItem.decimals,
    tokenItem.symbol,
    tokenItem.name
  );
  return _token;
}

export function useAllCommonPairs(
  currencyA?: Currency,
  currencyB?: Currency
): Pair[] {
  const { chainId } = useActiveWeb3React();

  const bases: Token[] = useMemo(
    () =>
      chainId ? SWAP_BASES[4].map((symbol) => getTokenWithSymbol(symbol)) : [],
    [chainId]
  );

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined];

  console.log("test tokenA  and tokenB", { tokenA, tokenB });
  const basePairs: [Token, Token][] = useMemo(
    () =>
      flatMap(bases, (base): [Token, Token][] =>
        bases.map((otherBase) => [base, otherBase])
      ).filter(([t0, t1]) => t0.address !== t1.address),
    [bases]
  );

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            .filter((tokens): tokens is [Token, Token] =>
              Boolean(tokens[0] && tokens[1])
            )
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true;
              const customBases = undefined; //GlobalData.bases.CUSTOM_BASES[chainId];
              if (!customBases) return true;

              const customBasesA: Token[] | undefined =
                customBases[tokenA.address];
              const customBasesB: Token[] | undefined =
                customBases[tokenB.address];

              if (!customBasesA && !customBasesB) return true;

              if (
                customBasesA &&
                !(customBasesA as Token[]).find((base) => tokenB.equals(base))
              )
                return false;
              if (
                customBasesB &&
                !(customBasesB as Token[]).find((base) => tokenA.equals(base))
              )
                return false;

              return true;
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  );

  console.log("test allpair combination ", allPairCombinations);

  const allPairs = usePairs(allPairCombinations);

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] =>
            Boolean(result[0] === PairState.EXISTS && result[1])
          )
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] =
              memo[curr.liquidityToken.address] ?? curr;
            return memo;
          }, {})
      ),
    [allPairs]
  );
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(
  currencyAmountIn?: CurrencyAmount,
  currencyOut?: Currency
): Trade | null {
  const allowedPairs = useAllCommonPairs(
    currencyAmountIn?.currency,
    currencyOut
  );

  console.log("result2 allowed pairs befire tradeIn ", {
    allowedPairs,
    currencyAmountIn,
    currencyOut,
  });
  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
          maxHops: 3,
          maxNumResults: 1,
        })[0] ?? null
      );
    }
    return null;
  }, [allowedPairs, currencyAmountIn, currencyOut]);
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount
): Trade | null {
  const allowedPairs = useAllCommonPairs(
    currencyIn,
    currencyAmountOut?.currency
  );

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
          maxHops: 3,
          maxNumResults: 1,
        })[0] ?? null
      );
    }
    return null;
  }, [allowedPairs, currencyIn, currencyAmountOut]);
}
