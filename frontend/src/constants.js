//mainnet contracts
export const pbrAddressMainnet = "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695";
export const biteAddressMainnet = "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d";
export const stakingAddressMainnet =
  "0x1b46b72c5280f30Fbe8A958B4f3c348FD0fD2E55";

//koven contracts/
export const pbrAddressKoven = "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0";
export const biteAddressKoven = "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA";
export const stakingAddressKoven = "0x7678f0AF7304e01554E2D49D96E55C8de4975c66";

// corgib
export const corgibStakingTestent =
  "0xA5c2186CFb734828EE89a4087FD571F12Af1E895";
export const corgibStakingMainent =
  "0x064dE1e65df3F40Afd7fb9E8A1Af61bD4545f4a1";
export const corgibMemeCoinTestent =
  "0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24";
export const corgibMemeCoinMainnet =
  "0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55";

//pbr-eth-pair router
export const pbrEthPairAddressTestnet =
  "0xc24e9758e2F229cb2235d7f1F8691f45Cb62dC0A";
export const pbrEthPairAddressMainnet =
  "0xc24e9758e2F229cb2235d7f1F8691f45Cb62dC0A";

//pwar

export const pwarAddressTestnet = "0x16153214E683018D5aA318864c8e692b66E16778";
export const pwarAddressMainnet = "0x16153214E683018D5aA318864c8e692b66E16778";

export const ETH = "ETH";
export const BNB = "BNB";
export const PBR = "PBR";
export const BITE = "BITE";
export const CORGIB = "CORGIB";
export const PWAR = "PWAR";

export const supportedTokens = {
  ethereum: [PBR, BITE, ETH],
  bsc: [BNB, CORGIB, PWAR],
};

export const exchangeFee = 0.25;
export const defaultSlippage = 0.5;
export const defaultTransactionDeadline = 20; //20 minutes

export const infuraKovenApi = `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
export const infuraMainnetApi = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

/**
 *
 *    'testnet'  BSC testnet testing
 *    'mainnet'  BSC/ETH mainent deployment
 */
export const currentConnection = "testnet";
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
