import { getTokenAddress } from "./utils/connectionUtils";

// new address format

export const tokenAddresses = {
  ethereum: {
    PBR: {
      testnet: '0xf6c9FF0543f932178262DF8C81A12A3132129b51',
      mainnet: '0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695'
    },
    USDT: {
      testnet: '0x117e41ec3ec246873D69BFA5659B8eB209e687d8',
      mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    USDC: {
      testnet: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
      mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    ETH: {
      testnet: '0xc778417e063141139fce010982780140aa0cd5ab',
      mainnet: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    }
  },
  bsc: {
    //todo
  },
  polygon: {
    //todo
  },
  harmony: {
    //
  }
}

export const routerAddresses = {
  ethereum: {
    testnet: '0x882724bee0a91190fc923e40A22807B2B71Bc817',
    mainnet: '0xd1D967e54DCAd47221a3388d8D6344Ebab1DE02D'
  },
  bsc: {
    testnet: '',
    mainnet: ''
  },
  polygon: {
    testnet: '',
    mainnet: ''
  },
  harmony: {
    testnet: '',
    mainnet: ''
  }
}

export const factoryAddresses = {
  ethereum: {
    testnet: '0x3AEa11900f8a35597520608a407c4B4E0141BC16',
    mainnet: '0xD7c31CaB8d289e9c4E14b3C7bC77A6b7A5aca753'
  },
  bsc: {
    testnet: '',
    mainnet: ''
  },
  polygon: {
    testnet: '',
    mainnet: ''
  },
  harmony: {
    testnet: '',
    mainnet: ''
  }
}


export const ETH = "ETH";
export const BNB = "BNB";
export const PBR = "PBR";
export const BITE = "BITE";
export const CORGIB = "CORGIB";
export const PWAR = "PWAR";
export const USDT = "USDT";
export const USDC = "USDC";

export const supportedTokens = {
  ethereum: [PBR, ETH, USDT, BITE],
  bsc: [BNB, CORGIB, PWAR],
};

export const TOKEN_BLACKLIST = [];
export const PAIR_BLACKLIST = [];

export const exchangeFee = 0.25;
export const defaultSlippage = 0.5;
export const defaultTransactionDeadline = 20; //20 minutes

export const infuraKovenApi = `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split('').reverse().join('')}`;
export const infuraMainnetApi = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split('').reverse().join('')}`;

/**
 *
 *    'testnet'  BSC testnet testing
 *    'mainnet'  BSC/ETH mainent deployment
 */
const testing = true;

export const currentConnection = testing ? "testnet" : "mainnet";
// export const currentConnection = "mainnet";

export const etheriumNetwork = "ethereum";
export const bscNetwork = "bsc";

export const etherConfig = {
  network_id: {
    mainet: "1",
    koven: "42",
  },
};

export const bscConfig = {
  network_id: {
    mainnet: "56",
    testnet: "97",
  },
  network_rpc_mainnet: "https://bsc-dataseed.binance.org/",
  network_rpc_testnet: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};

export const supportedNetworks = ["1", "56"];

//pairs
export const PBR_ETH = "PBR_ETH";
export const PWAR_BNB = "PWAR_BNB";
export const PWAR_CORGIB = "PWAR_CORGIB";
export const CORGIB_BNB = "CORGIB_BNB";

export const bscTokens = [
  {
    name: "Polkawar",
    symbol: "PWAR",
    address: getTokenAddress(PWAR)
  },
  {
    name: "Corgib meme coin",
    symbol: "CORGIB",
    address: getTokenAddress(CORGIB)
  },
  {
    name: "Binance",
    symbol: "BNB",
    address: getTokenAddress(BNB),
  },
];
export const tokens = [
  {
    name: "Polkabridge",
    symbol: "PBR",
    address: getTokenAddress(PBR)
  },
  {
    name: "DragonBite",
    symbol: "BITE",
    address: getTokenAddress(BITE)
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: getTokenAddress(ETH)
  },
  {
    name: "US Tether",
    symbol: "USDT",
    address: getTokenAddress(USDT)
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: getTokenAddress(USDC)
  },
  // {
  //   name: "1INCH Token",
  //   symbol: "1INCH",
  //   address:
  //     currentConnection === "testnet"
  //       ? "0xcc521406C8F796169DCe1D10bDe6AaA60847FB63"
  //       : "0x111111111117dc0aa78b770fa6a738034120c302",
  // },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  },
  {
    name: "Amp",
    symbol: "AMP",
    address: "0xfF20817765cB7f73d4bde2e66e067E58D11095C2",
  },
  {
    name: "Aragon Network Token",
    symbol: "ANT",
    address: "0xa117000000f279d81a1d3cc75430faa017fa5a2e",
  },
  {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
  },
  {
    name: "Pax Dollar",
    symbol: "PAX",
    address: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
  },
  {
    name: "yearn.finance",
    symbol: "YFI",
    address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
  },
  {
    name: "DFI.Money",
    symbol: "YFII",
    address: "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83",
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  {
    name: "wDogecoin",
    symbol: "WDOGE",
    address: "0xf40c1f421ee02a550afdd8712ef34dce97eec6f2",
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
  },
  {
    name: "Maker",
    symbol: "MKR",
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  },
  {
    name: "Compound",
    symbol: "COMP",
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
  },
  {
    name: "The Sandbox",
    symbol: "SAND",
    address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
  },
  // {
  //   name: "Uniswap",
  //   symbol: "UNI",
  //   address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  // },
  {
    name: "Balancer",
    symbol: "BAL",
    address: "0xba100000625a3754423978a60c9317c58a424e3D",
  },
  {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
  },
  {
    name: "The Graph",
    symbol: "GRT",
    address: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
  },
  {
    name: "Kyber Network Crystal v2",
    symbol: "KNC",
    address: "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202",
  },
  {
    name: "Decentraland",
    symbol: "MANA",
    address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
  },
  {
    name: "0x",
    symbol: "ZRX",
    address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
  },
  {
    name: "Axie Infinity",
    symbol: "AXS",
    address: "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
  },
  {
    name: "THORChain",
    symbol: "RUNE",
    address: "RUNE-B1A",
  },
  {
    name: "NEXO",
    symbol: "NEXO",
    address: "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206",
  },
  {
    name: "Basic Attention Token",
    symbol: "BAT",
    address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  },
];

export const DECIMAL_6_ADDRESSES = [
  tokenAddresses.ethereum.USDC.testnet,
  tokenAddresses.ethereum.USDC.mainnet,
]

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const timeframeOptions = {
  WEEK: "1 week",
  MONTH: "1 month",
  THREE_MONTHS: "3 months",
  YEAR: "1 year",
  HALF_YEAR: "6 months",
  ALL_TIME: "All time",
};

export const BUNDLE_ID = "1";

export const swapFnConstants = {
  swapExactETHForTokens: "swapExactETHForTokens", // case 1
  swapETHforExactTokens: "swapETHforExactTokens", // case2
  swapExactTokensForETH: "swapExactTokensForETH", // case3
  swapTokensForExactETH: "swapTokensForExactETH", // case 4
  swapExactTokensForTokens: "swapExactTokensForTokens", // case 5
  swapTokensForExactTokens: "swapTokensForExactTokens", // case 6
};


export const THRESOLD_VALUE = 0.00001
export const THRESOLD_WEI_VALUE = 100000000000000