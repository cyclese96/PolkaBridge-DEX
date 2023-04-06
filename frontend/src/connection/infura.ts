import { recoverKeys } from "utils/helper";
import { SupportedChainId } from "./chains";

const INFURA_KEY = recoverKeys(process.env.REACT_APP_INFURA_ID);
if (typeof INFURA_KEY === "undefined") {
  throw new Error(
    `REACT_APP_INFURA_KEY must be a defined environment variable`
  );
}

export const FALLBACK_URLS: any = {
  [SupportedChainId.MAINNET]: [
    // "Safe" URLs
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com",
    // "Fallback" URLs
    "https://rpc.ankr.com/eth",
    "https://eth-mainnet.public.blastapi.io",
  ],
  [SupportedChainId.ROPSTEN]: [
    // "Fallback" URLs
    "https://rpc.ankr.com/eth_ropsten",
  ],
  [SupportedChainId.RINKEBY]: [
    // "Fallback" URLs
    "https://rinkeby-light.eth.linkpool.io/",
  ],
  [SupportedChainId.GOERLI]: [
    // "Safe" URLs
    "https://rpc.goerli.mudit.blog/",
    // "Fallback" URLs
    "https://rpc.ankr.com/eth_goerli",
  ],
  [SupportedChainId.KOVAN]: [
    // "Safe" URLs
    "https://kovan.poa.network",
    // "Fallback" URLs
    "https://eth-kovan.public.blastapi.io",
  ],
  [SupportedChainId.POLYGON]: [
    // "Safe" URLs
    "https://polygon-rpc.com/",
    "https://rpc-mainnet.matic.network",
    "https://matic-mainnet.chainstacklabs.com",
    "https://rpc-mainnet.maticvigil.com",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://matic-mainnet-full-rpc.bwarelabs.com",
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    // "Safe" URLs
    "https://matic-mumbai.chainstacklabs.com",
    "https://rpc-mumbai.maticvigil.com",
    "https://matic-testnet-archive-rpc.bwarelabs.com",
  ],
  [SupportedChainId.ARBITRUM_ONE]: [
    // "Safe" URLs
    "https://arb1.arbitrum.io/rpc",
    // "Fallback" URLs
    "https://arbitrum.public-rpc.com",
  ],
  [SupportedChainId.ARBITRUM_RINKEBY]: [
    // "Safe" URLs
    "https://rinkeby.arbitrum.io/rpc",
  ],
  [SupportedChainId.OPTIMISM]: [
    // "Safe" URLs
    "https://mainnet.optimism.io/",
    // "Fallback" URLs
    "https://rpc.ankr.com/optimism",
  ],
  [SupportedChainId.BSC_TESTNET]: [
    // "Safe" URLs
    "https://rpc.ankr.com/bsc_testnet_chapel",
    "https://data-seed-prebsc-1-s2.binance.org:8545/",
    "https://data-seed-prebsc-1-s2.binance.org:8545	",
    "https://bsctestapi.terminet.io/rpc	",
  ],
  [SupportedChainId.BSC]: [],
};

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS: any = {
  [SupportedChainId.MAINNET]: [
    `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.RINKEBY]: [
    `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.RINKEBY],
  ],
  [SupportedChainId.ROPSTEN]: [
    `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.ROPSTEN],
  ],
  [SupportedChainId.GOERLI]: [
    `https://goerli.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.GOERLI],
  ],
  [SupportedChainId.KOVAN]: [
    `https://kovan.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.KOVAN],
  ],
  [SupportedChainId.OPTIMISM]: [
    `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.OPTIMISM],
  ],

  [SupportedChainId.ARBITRUM_ONE]: [
    `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.ARBITRUM_ONE],
  ],
  [SupportedChainId.ARBITRUM_RINKEBY]: [
    `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.ARBITRUM_RINKEBY],
  ],
  [SupportedChainId.POLYGON]: [
    `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.POLYGON],
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
  ],
  [SupportedChainId.BSC_TESTNET]: [
    `https://rpc.ankr.com/bsc_testnet_chapel`,
    ...FALLBACK_URLS[SupportedChainId.BSC_TESTNET],
  ],
  [SupportedChainId.BSC]: [
    "https://bsc-dataseed.binance.org/",
    "https://bsc-dataseed1.defibit.io/",
    "https://bsc-dataseed1.ninicoin.io/",
    "https://bsc-dataseed2.defibit.io/",
    ...FALLBACK_URLS[SupportedChainId.BSC],
  ],
};
