import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

const APIURL =
  "https://api.studio.thegraph.com/query/5591/polkabridge-amm-test/1.0.6"; // testnet subgraph api
const API_MAINNET = `https://gateway.thegraph.com/api/${process.env.REACT_APP_GRAPH_API?.split(
  ""
)
  ?.reverse()
  ?.join("")}/deployments/id/QmcpX4ScNaWfSE1ZmfEFM3mPSCz5frk6edwsYMAvfGtrXV`; // dencentralized subgraph api

const QUERY_URL = {
  1: API_MAINNET,
  4: APIURL,
  97: "https://api.thegraph.com/subgraphs/name/aamiralam/polkabridge-amm-bsc",
  56: "https://api.thegraph.com/subgraphs/id/Qmag97G4eeNXQLdgxXtJG7GuE1kiP4C7UGhMzmL9MAyviq",
};

// const BLOCKS_API_TESTNET =
//   "https://api.studio.thegraph.com/query/8207/rinkeby-blocks/0.0.1";
// const BLOCKS_API_MAINNET =
//   "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks";

const BLOCKS_API = {
  1: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
  4: "https://api.studio.thegraph.com/query/8207/rinkeby-blocks/0.0.1",
  56: "https://api.thegraph.com/subgraphs/name/alium-finance/bsc-blocks",
  97: "https://api.thegraph.com/subgraphs/name/ducquangkstn/ethereum-blocks-bsctestnet",
};

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/index-node/graphql",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: BLOCKS_API[1],
  }),
  cache: new InMemoryCache(),
});

export const blockClientRinkeby = new ApolloClient({
  link: new HttpLink({
    uri: BLOCKS_API[4],
  }),
  cache: new InMemoryCache(),
});

export const blockClientBscTestnet = new ApolloClient({
  link: new HttpLink({
    uri: BLOCKS_API[97],
  }),
  cache: new InMemoryCache(),
});

export const blockClientBscMainnet = new ApolloClient({
  link: new HttpLink({
    uri: BLOCKS_API[56],
  }),
  cache: new InMemoryCache(),
});

export const blockClients = {
  1: blockClient,
  4: blockClientRinkeby,
  56: blockClientBscMainnet,
  97: blockClientBscTestnet,
};

export const client = new ApolloClient({
  link: new HttpLink({
    uri: QUERY_URL[1],
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const clientEthTestnet = new ApolloClient({
  link: new HttpLink({
    uri: QUERY_URL[4],
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const clientBscTestnet = new ApolloClient({
  link: new HttpLink({
    uri: QUERY_URL[1],
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const clientBscMainnet = new ApolloClient({
  link: new HttpLink({
    uri: QUERY_URL[56],
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const clients = {
  1: client,
  4: clientEthTestnet,
  56: clientBscMainnet,
  97: clientBscTestnet,
};

// export default client;
