export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: "mainnet",
  [SupportedChainId.ROPSTEN]: "ropsten",
  [SupportedChainId.RINKEBY]: "rinkeby",
  [SupportedChainId.POLYGON]: "polygon",
  [SupportedChainId.POLYGON_MUMBAI]: "polygon_mumbai",
};
