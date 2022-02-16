const testing = true;

export const currentConnection = testing ? "testnet" : "mainnet";

export const tokenAddresses = {
  ethereum: {
    PBR: {
      testnet: "0xf6c9FF0543f932178262DF8C81A12A3132129b51",
      mainnet: "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695",
    },
    USDT: {
      testnet: "0xe687b0a94c3a20540552d981cd311a6812759df8",
      mainnet: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    USDC: {
      testnet: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
      mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    ETH: {
      testnet: "0xc778417e063141139fce010982780140aa0cd5ab",
      mainnet: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
    BITE: {
      testnet: "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA",
      mainnet: "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d",
    },
  },
  bsc: {
    PWAR: {
      testnet: "0x16153214E683018D5aA318864c8e692b66E16778",
      mainnet: "0x16153214E683018D5aA318864c8e692b66E16778",
    },
    CORGIB: {
      testnet: "0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24",
      mainnet: "0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55",
    },
  },
  polygon: {
    //todo
  },
  harmony: {
    //
  },
};

export const routerAddresses = {
  ethereum: testing
    ? "0x3230cD16e2A84153fE297fA1bb6232d63D433c11"
    : "0x8A2795aE669476Bf119A1a40FbFD75cA71Fd35c4",
  moonriver: testing
    ? "0x1C586Bc16e9Aa5fdf45F4dB3F37Bd97cA25A5aE9"
    : "0x1C586Bc16e9Aa5fdf45F4dB3F37Bd97cA25A5aE9", //todo update mainnet address
};

export const factoryAddresses = {
  ethereum: testing
    ? "0x2943FDe66598b17EEC9DD1f31c4DB516bf800046"
    : "0xeff9EcEFe14279C0157f88573Ca9361D253c10bE",
  moonriver: testing
    ? "0x2fc26998c0EB0CC67DC9d41f7f1F4508dE214292"
    : "0x2fc26998c0EB0CC67DC9d41f7f1F4508dE214292", // todo update mainnet address
};

export const farmAddresses = {
  ethereum: testing
    ? "0x3CaE9670608b9Dd43a90713B1812a728AdC119a2"
    : "0xBaF15D830ddeB6c11fFae8890d9c902D8dF1f3E7",
};

export const farmContractConfig = {
  startBlock: 9829062,
  startTimestamp: 1639730634,
};

export const ETH = "ETH";
export const BNB = "BNB";
export const PBR = "PBR";
export const BITE = "BITE";
export const CORGIB = "CORGIB";
export const PWAR = "PWAR";
export const USDT = "USDT";
export const USDC = "USDC";
export const MOVR = "MOVR";

export const defaultSwapInputToken = {
  ethereum: "ETH",
  moonriver: "WMOVR",
};

export const defaultPoolToken0 = {
  ethereum: "ETH",
  moonriver: "WMOVR",
};

export const defaultPoolToken1 = {
  ethereum: "PBR",
  moonriver: "USDT",
};

export const TOKEN_BLACKLIST = [];
export const PAIR_BLACKLIST = [];

export const exchangeFee = 0.25;
export const defaultSlippage = 0.5;
export const defaultTransactionDeadline = 20; //20 minutes

export const etheriumNetwork = "ethereum";
export const bscNetwork = "bsc";
export const moonriverNetwork = "moonriver";

export const supportedChains = [1, 4, 1285, 1287];

export const allowanceAmount = "9999999999999999999999999";

export const blocksExplorer = {
  ethereum: {
    testnet: "https://rinkeby.etherscan.io",
    mainnet: "https://etherscan.io",
  },
  moonriver: {
    testnet: "https://moonbase.moonscan.io",
    mainnet: "https://moonriver.moonscan.io",
  },
};

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const timeframeOptions = {
  WEEK: "1 week",
  MONTH: "1 month",
  // THREE_MONTHS: "3 months",
  // YEAR: "1 year",
  // HALF_YEAR: "6 months",
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

export const THRESOLD_VALUE = 0.00001;
export const THRESOLD_WEI_VALUE = 100000000000000;

export const supportedFarmingPools = {
  ethereum: ["PBR-ETH", "ETH-USDT"],
};

export const farmingPoolConstants = {
  ethereum: {
    "PBR-ETH": {
      multiplier: 40,
      pid: 0,
      address: "0xC6bf4941947d589dB69CeA26409eB4530B08D560",
      blocksPerYear: "",
      lpApr: 0,
      decimals: 18,
    },
    "ETH-USDT": {
      multiplier: 5,
      pid: 1,
      address: "0x218C429b2F172d84AdC13bC5078D26aC63b9bAD6",
      blocksPerYear: "",
      lpApr: 0,
      decimals: 12,
    },
  },
};

export const RINKEBY_BLOCK_TIME = 15;
export const PBR_PER_BLOCK = 0.5;
export const BLOCKS_PER_YEAR = (60 / RINKEBY_BLOCK_TIME) * 60 * 24 * 365;
export const PBR_PER_YEAR = PBR_PER_BLOCK * BLOCKS_PER_YEAR;

export const BASE_URL =
  process.env.NODE_ENV && process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_URL
    : process.env.REACT_APP_PRODUCTION_URL;

export const SWAP_BASES = {
  1: ["USDT", "USDC", "ETH"], //eth chains
  42: ["USDT", "USDC", "ETH"],
  1285: ["USDT", "MOVR"],
  1287: ["USDT", "MOVR"],
};
