import { NATIVE_TOKEN } from "constants/index";
import {
  Currency,
  CurrencyAmount,
  ETHER,
  Token,
  TokenAmount,
  WETH,
} from "polkabridge-sdk";

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: number | undefined
): Token | undefined {
  return chainId && currency?.symbol === NATIVE_TOKEN?.[chainId]
    ? WETH?.[chainId]
    : currency instanceof Token && currency.chainId === chainId
    ? currency
    : undefined;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: number | undefined
): TokenAmount | undefined {
  const token =
    currencyAmount && chainId
      ? wrappedCurrency(currencyAmount.currency, chainId)
      : undefined;
  return token && currencyAmount
    ? new TokenAmount(token, currencyAmount.raw)
    : undefined;
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH[4])) return ETHER;
  return token;
}
