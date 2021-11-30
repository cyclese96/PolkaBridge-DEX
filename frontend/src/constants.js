import { getTokenAddress } from "./utils/connectionUtils";

// new address format

export const tokenAddresses = {
  ethereum: {
    PBR: {
      testnet: '0xf6c9FF0543f932178262DF8C81A12A3132129b51',
      mainnet: '0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695'
    },
    USDT: {
      testnet: '0xe687b0a94c3a20540552d981cd311a6812759df8',
      mainnet: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    USDC: {
      testnet: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
      mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    ETH: {
      testnet: '0xc778417e063141139fce010982780140aa0cd5ab',
      mainnet: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    BITE: {
      testnet: '0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA',
      mainnet: '0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d'
    }
  },
  bsc: {
    PWAR: {
      testnet: '0x16153214E683018D5aA318864c8e692b66E16778',
      mainnet: '0x16153214E683018D5aA318864c8e692b66E16778'
    },
    CORGIB: {
      testnet: '0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24',
      mainnet: '0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55'
    }
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
    testnet: '0x76ED9803Ba3085a7bB0e6a666C924e376f5B9E29',
    mainnet: '0x8A2795aE669476Bf119A1a40FbFD75cA71Fd35c4'
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
    testnet: '0xA5d426Fa8C76ecD6F937f84442d1C0B26fb11286',
    mainnet: '0xeff9EcEFe14279C0157f88573Ca9361D253c10bE'
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

export const etheriumNetwork = "ethereum";
export const bscNetwork = "bsc";
export const moonriverNetwork = "moonriver";

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

export const allowanceAmount = '9999999999999999999999999';

//pairs
export const PBR_ETH = "PBR_ETH";
export const PWAR_BNB = "PWAR_BNB";
export const PWAR_CORGIB = "PWAR_CORGIB";
export const CORGIB_BNB = "CORGIB_BNB";

export const bscTokens = [
  {
    name: "Polkawar",
    symbol: "PWAR",
    address: getTokenAddress(PWAR),
    decimals: 18
  },
  {
    name: "Corgib meme coin",
    symbol: "CORGIB",
    address: getTokenAddress(CORGIB),
    decimals: 18
  },
  {
    name: "Binance",
    symbol: "BNB",
    address: getTokenAddress(BNB),
    decimals: 18
  },
];
export const tokens = [
  {
    name: "Polkabridge",
    symbol: "PBR",
    address: getTokenAddress(PBR),
    decimals: 18
  },
  {
    name: "DragonBite",
    symbol: "BITE",
    address: getTokenAddress(BITE),
    decimals: 18
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: getTokenAddress(ETH),
    decimals: 18
  },
  {
    name: "US Tether",
    symbol: "USDT",
    address: getTokenAddress(USDT),
    decimals: 6
  },
  // {
  //   name: "US Tether12",
  //   symbol: "USDT12",
  //   address: '0xb6083cf9c33ccde1711ecb63cff1b0dd2cf06c09',
  //   decimals: 12
  // },
  // {
  //   name: "US Tether8",
  //   symbol: "USDT8",
  //   address: '0x1793fbb125512015099261d339ed2e2f3fe94b2d',
  //   decimals: 8
  // },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: getTokenAddress(USDC),
    decimals: 6
  },
  // {
  //   name: "1INCH Token",
  //   symbol: "1INCH",
  //   address:
  //     currentConnection === "testnet"
  //       ? "0xcc521406C8F796169DCe1D10bDe6AaA60847FB63"
  //       : "0x111111111117dc0aa78b770fa6a738034120c302",
  //   decimals: 18
  // },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18
  },
  {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    decimals: 18
  },
  {
    name: "Amp",
    symbol: "AMP",
    address: "0xfF20817765cB7f73d4bde2e66e067E58D11095C2",
    decimals: 18
  },
  {
    name: "Aragon Network Token",
    symbol: "ANT",
    address: "0xa117000000f279d81a1d3cc75430faa017fa5a2e",
    decimals: 18
  },
  {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    decimals: 18
  },
  {
    name: "Pax Dollar",
    symbol: "PAX",
    address: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
    decimals: 18,
  },
  {
    name: "yearn.finance",
    symbol: "YFI",
    address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
    decimals: 18,
  },
  {
    name: "DFI.Money",
    symbol: "YFII",
    address: "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83",
    decimals: 18,
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 18,
  },
  {
    name: "wDogecoin",
    symbol: "WDOGE",
    address: "0xf40c1f421ee02a550afdd8712ef34dce97eec6f2",
    decimals: 18,
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    decimals: 18,
  },
  {
    name: "Maker",
    symbol: "MKR",
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    decimals: 18,
  },
  {
    name: "Compound",
    symbol: "COMP",
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    decimals: 18,
  },
  {
    name: "The Sandbox",
    symbol: "SAND",
    address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
    decimals: 18,
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
    decimals: 18,
  },
  {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    decimals: 18,
  },
  {
    name: "The Graph",
    symbol: "GRT",
    address: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
    decimals: 18,
  },
  {
    name: "Kyber Network Crystal v2",
    symbol: "KNC",
    address: "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202",
    decimals: 18,
  },
  {
    name: "Decentraland",
    symbol: "MANA",
    address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
    decimals: 18,
  },
  {
    name: "0x",
    symbol: "ZRX",
    address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
    decimals: 18,
  },
  {
    name: "Axie Infinity",
    symbol: "AXS",
    address: "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
    decimals: 18,
  },
  {
    name: "THORChain",
    symbol: "RUNE",
    address: "RUNE-B1A",
    decimals: 18,
  },
  {
    name: "NEXO",
    symbol: "NEXO",
    address: "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206",
    decimals: 18,
  },
  {
    name: "Basic Attention Token",
    symbol: "BAT",
    address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    decimals: 18,
  },
];

const moonriverTokens = [
  {
    name: "Wrapped Moonriver",
    symbol: "WMOVR",
    address: testing ? "" : "0x98878b06940ae243284ca214f92bb71a2b032b8a",
    decimals: 18,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: testing ? "" : "",
    decimals: 6,
  },
  {
    name: "US Tether",
    symbol: "USDT",
    address: testing ? "" : "",
    decimals: 6,
  },
  {
    name: "Frax",
    symbol: "FRAX",
    address: testing ? "" : "0x853d955acef822db058eb8505911ed77f175b99e",
    decimals: 6,
  },
  {
    name: "MIM",
    symbol: "MIN",
    address: testing ? "" : "",
    decimals: 6,
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: testing ? "" : "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 18,
  },
  {
    name: "Sushi Swap",
    symbol: "SUSHI",
    address: testing ? "" : "",
    decimals: 18,
  },
  {
    name: "Aave Token",
    symbol: "AAVE",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Ad Ex Network",
    symbol: "ADX",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Aergo",
    symbol: "Aergo",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "ankr Eth",
    symbol: "aETHc",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "ag EUR",
    symbol: "ag EUR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Adventure Gold",
    symbol: "AGLD",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Akropolis",
    symbol: "AKRO",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Alchemix",
    symbol: "ALCX",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Aleph",
    symbol: "ALEPH",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Alpha Finance",
    symbol: "ALPHA",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Alchemix USD",
    symbol: "al USD",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "AMP",
    symbol: "AMP",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Ampleforth",
    symbol: "AMPL",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Angle",
    symbol: "ANGLE",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Ankr Network",
    symbol: "ANKR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Arogon",
    symbol: "ANT",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Any Swap",
    symbol: "ANY",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "API3",
    symbol: "API3",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "apWine Token",
    symbol: "APW",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Archer DAO",
    symbol: "ARCH",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "ARC Governance",
    symbol: "ARCx",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Armor",
    symbol: "ARMOR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Armor NXM",
    symbol: "arNXM",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Asgard",
    symbol: "ASG",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Assy Index",
    symbol: "ASSY",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Attrace",
    symbol: "ATTR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Bounce Token",
    symbol: "AUCTION",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Avastars",
    symbol: "AVASTR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Axie Infinity Shard",
    symbol: "AXS",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Basis Bond",
    symbol: "BAB",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Basis Cash",
    symbol: "BAB",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "ag EUR",
    symbol: "ag EUR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Alpha Rome",
    symbol: "aROME",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Avax-AnySwap",
    symbol: "AVAX",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "MoonBeans",
    symbol: "BEANS",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "BEPRO Network",
    symbol: "BEPRO",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Beefy Finance",
    symbol: "BIFI",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "ag EUR",
    symbol: "ag EUR",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "BNB-Meter",
    symbol: "BNB",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Binance USD",
    symbol: "BUSD",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Fantom",
    symbol: "FTM",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "ChainLink Token",
    symbol: "Link",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Mai Mi Matic",
    symbol: "MAI",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Matic",
    symbol: "MATIC",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Magic Internet Money",
    symbol: "MIM",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Meter Governance",
    symbol: "MTRG",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "PolkaMarkets",
    symbol: "POLK",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Relay",
    symbol: "RELAY",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "RivrDoge",
    symbol: "RivrDoge",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Rivr Shiba",
    symbol: "RIVRSHIBA",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Synthetix Network Token",
    symbol: "SNX",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Sushi Token",
    symbol: "SUSHI",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: testing ? " " : "",
    decimals: 18,
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: testing ? " " : "",
    decimals: 18,
  },

  {
    name: "yearn.finance",
    symbol: "YFI",
    address: testing ? " " : "",
    decimals: 18,
  },
];

export const allNetworkTokens = {
  'ethereum': tokens,
  'moonriver': moonriverTokens
}

export const blocksExplorer = {
  'ethereum': {
    'testnet': 'https://rinkeby.etherscan.io',
    'mainnet': 'https://etherscan.io'
  },
  'moonriver': {
    'testnet': 'https://moonbase.moonscan.io',
    'mainnet': 'https://moonriver.moonscan.io'
  }
}

export const DECIMAL_6_ADDRESSES = [
  tokenAddresses.ethereum.USDC.testnet,
  tokenAddresses.ethereum.USDC.mainnet,
  tokenAddresses.ethereum.USDT.testnet,
  tokenAddresses.ethereum.USDT.mainnet,
]

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


export const THRESOLD_VALUE = 0.00001
export const THRESOLD_WEI_VALUE = 100000000000000