import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { currentConnection } from "../constants/index";
// import { HttpLink } from 'apollo-link-http'

const APIURL =
  "https://api.studio.thegraph.com/query/5591/polkabridge-amm-test/1.0.6"; // testnet subgraph api
const API_MAINNET = `https://gateway.thegraph.com/api/${process.env.REACT_APP_GRAPH_API?.split(
  ""
)
  ?.reverse()
  ?.join("")}/deployments/id/QmcpX4ScNaWfSE1ZmfEFM3mPSCz5frk6edwsYMAvfGtrXV`; // dencentralized subgraph api

// const API_MAINNET =
//   "https://api.studio.thegraph.com/query/2992/polkabridge-amm-v1/3.5.9"; // mainnet temp query url

const BLOCKS_API_TESTNET =
  "https://api.studio.thegraph.com/query/8207/rinkeby-blocks/0.0.1";
const BLOCKS_API_MAINNET =
  "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks";
// const tokensQuery = `
//   query {
//     tokens {
//       id
//       tokenID
//       contentURI
//       metadataURI
//     }
//   }
// `

// const client = new ApolloClient({
//   uri: APIURL,
//   cache: new InMemoryCache(),
// });

// client.query({
//   query: gql(tokensQuery)
// })
// .then(data => console.log("Subgraph data: ", data))
// .catch(err => { console.log("Error fetching data: ", err) });

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/index-node/graphql",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

const _blocksApi =
  currentConnection === "testnet" ? BLOCKS_API_TESTNET : BLOCKS_API_MAINNET;
export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: _blocksApi,
  }),
  cache: new InMemoryCache(),
});

const _api = currentConnection === "testnet" ? APIURL : API_MAINNET;
export const client = new ApolloClient({
  link: new HttpLink({
    uri: _api,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

// export default client;
