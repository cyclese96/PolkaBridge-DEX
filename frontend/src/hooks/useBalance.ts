import {
  Currency,
  CurrencyAmount,
  JSBI,
  Token,
  TokenAmount,
} from "polkabridge-sdk";
import { useMemo } from "react";
import {
  useMultipleContractSingleData,
  useSingleContractMultipleData,
} from "state/multicall/hooks";
import { isAddress } from "utils/contractUtils";
import { useInterfaceMulticall } from "./useContract";
import ERC20_ABI from "../contracts/abi/erc20.json";
import { Interface } from "@ethersproject/abi";
import { ETH, NATIVE_TOKEN } from "constants/index";
import useActiveWeb3React from "./useActiveWeb3React";

const ERC20_INTERFACE = new Interface(ERC20_ABI);

export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount | undefined;
} {
  const multicallContract = useInterfaceMulticall();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(() => {
    return addresses.reduce<{ [address: string]: CurrencyAmount }>(
      (memo, address, i) => {
        const value = results?.[i]?.result?.[0];

        if (value) {
          memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()));
        }
        return memo;
      },
      {}
    );
  }, [addresses, results]);
}

export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    [address]
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: TokenAmount | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(
  account?: string,
  token?: Token
): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const { chainId } = useActiveWeb3React();

  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency instanceof Token
      ) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);

  const containsETH: boolean = useMemo(
    () =>
      currencies?.some(
        (currency) => chainId && currency?.symbol === NATIVE_TOKEN?.[chainId]
      ) ?? false,
    [currencies, chainId]
  );

  const ethBalance = useETHBalances(containsETH ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (chainId && currency?.symbol === NATIVE_TOKEN?.[chainId])
          return ethBalance[account];
        if (currency instanceof Token) return tokenBalances[currency.address];
        return undefined;
      }) ?? [],
    [account, currencies, ethBalance, chainId, tokenBalances]
  );
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0];
}
