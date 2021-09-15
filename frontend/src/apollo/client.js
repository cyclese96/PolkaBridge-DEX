import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
// import { HttpLink } from 'apollo-link-http'
// const APIURL =
// "https://gateway.thegraph.com/api/584823fe20b487773537ceae7d79941b/subgraphs/id/0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0-0";
const APIURL = "https://api.studio.thegraph.com/query/8207/amm/0.8.2";
const BLOCKS_API_TESTNET = "https://api.studio.thegraph.com/query/8207/rinkeby-blocks/0.0.1";
const BLOCKS_API_MAINNET = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks';
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
    uri: 'https://api.thegraph.com/index-node/graphql',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})


export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: BLOCKS_API_TESTNET,
  }),
  cache: new InMemoryCache(),
})



export const client = new ApolloClient({
  link: new HttpLink({
    uri: APIURL,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

// export default client;
