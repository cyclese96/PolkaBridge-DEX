import { BLOCK_EXPLORER } from "constants/index";
import Decimal from "decimal.js-light";
import { Numeral } from "numeral";

export const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// using a currency library here in case we want to add more in future
// format value without B, M & K symbols for large numbers
export const formatDollarAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat([], {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return formatter.format(num);
};

export const formatCurrency = (value, precision = 1) => {
  if (!value) {
    return "0";
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: precision,
  });

  //for currency format with $symbol
  if (!value) {
    return formatter.format(0).slice(1);
  }

  return convertToInternationalCurrencySystem(value, formatter);
};

function convertToInternationalCurrencySystem(labelValue, formatter) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e9).toFixed(2))
        .slice(1) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e6).toFixed(2))
        .slice(1) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e3).toFixed(2))
        .slice(1) + "K"
    : formatter.format(Math.abs(Number(labelValue))).slice(1);
}

export const toSignificant = (number, significantDigits) => {
  Decimal.set({ precision: significantDigits + 1, rounding: Decimal.ROUND_UP });
  const updated = new Decimal(number).toSignificantDigits(significantDigits);
  return updated.toFormat(updated.decimalPlaces(), { groupSeparator: "" });
};

export const toK = (num) => {
  return Numeral(num).format("0.[00]a");
};

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
  try {
    if (isNaN(number) || number === "" || number === undefined) {
      return usd ? "$0" : 0;
    }
    let num = parseFloat(number);

    if (num > 500000000) {
      return (usd ? "$" : "") + toK(num.toFixed(0), true);
    }

    if (num === 0) {
      if (usd) {
        return "$0";
      }
      return 0;
    }

    if (num < 0.0001 && num > 0) {
      return usd ? "< $0.0001" : "< 0.0001";
    }

    if (num > 1000) {
      return usd
        ? formatDollarAmount(num, 0)
        : Number(parseFloat(num).toFixed(0)).toLocaleString();
    }

    if (usd) {
      if (num < 0.1) {
        return formatDollarAmount(num, 4);
      } else {
        return formatDollarAmount(num, 2);
      }
    }

    return Number(parseFloat(num).toFixed(4)).toString();
  } catch (error) {
    console.log("formatter crashed ", { error, number });
    return 0;
  }
};

export const urls = {
  showTransaction: (tx, chainId = 1) => `${BLOCK_EXPLORER[chainId]}/tx/${tx}/`,
  showAddress: (address, chainId = 1) =>
    `${BLOCK_EXPLORER[chainId]}/address/${address}/`,
  showToken: (address, chainId = 1) =>
    `${BLOCK_EXPLORER[chainId]}/token/${address}/`,
  showBlock: (block, chainId = 1) =>
    `${BLOCK_EXPLORER[chainId]}/block/${block}/`,
};

export function localNumber(val) {
  return Numeral(val).format("0,0");
}
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
