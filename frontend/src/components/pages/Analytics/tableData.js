//   createData(1, "Ether", "ETH", 2330, 2.74, 882.93, 573.84), // dataset contains coinName, currPrice, priceChange, Vol24H, TVL
//   createData(2, "USD Coin", "USDC", 1.0, 0.0, 529.2, 536.11),
//   createData(3, "Tetcher USD", "USDT", 1.0, -0.03, 162.22, 177.01),
//   createData(4, "Polkabridge", "PBR", 1.0, 0.0, 92.56, 131.58),
//   createData(5, "Polkawar", "PWAR", 1.0, 0.0, 92.56, 131.58),
//   createData(6, "Corgib", "CORGIB", 1.0, 0.0, 92.56, 131.58),
export const topTokensData = [
  {
    id: 1,
    name: "Ether",
    symbol: "ETH",
    price: 2330,
    price_change: 2.74,
    vol_24_h: 882.93,
    tvl: 572.82,
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "USDC",
    price: -0.9,
    price_change: 2.74,
    vol_24_h: 882.93,
    tvl: 572.82,
  },
  {
    id: 1,
    name: "Tether USD",
    symbol: "USDT",
    price: 1.0,
    price_change: 2.74,
    vol_24_h: 882.93,
    tvl: 572.82,
  },
  {
    id: 1,
    name: "Polkabridge",
    symbol: "PBR",
    price: 0.14,
    price_change: 50,
    vol_24_h: 882.93,
    tvl: 572.82,
  },
];

export const topPoolsData = [
  {
    id: 1,
    pairTokens: ["USDC", "ETH"],
    fee: 0.3,
    tvl: 572.82,
    vol_24_h: 882.93,
    vol_7_d: 882.93,
  },
  {
    id: 2,
    pairTokens: ["ETH", "PBR"],
    fee: 0.3,
    tvl: 572.82,
    vol_24_h: 882.93,
    vol_7_d: 882.93,
  },
  {
    id: 1,
    pairTokens: ["BNB", "PWAR"],
    fee: 0.3,
    tvl: 572.82,
    vol_24_h: 882.93,
    vol_7_d: 882.93,
  },
];

export const transactionsData = [
  {
    id: 1,
    transactionType: "swap",
    fromToken: { symbol: "ETH", amount: 1.0003 },
    toTokenL: { symbol: "PBR", amount: 42021 },
    totalValue: 20000,
    account: "0x9d1599C943AaDb3c0A1964d159113dF913E08f64",
    time: "2 minutes ago",
  },
];
