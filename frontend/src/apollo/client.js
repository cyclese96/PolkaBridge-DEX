import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// const APIURL =
// "https://gateway.thegraph.com/api/584823fe20b487773537ceae7d79941b/subgraphs/id/0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0-0";
const APIURL = "https://api.studio.thegraph.com/query/2992/pbr-stake/0.3";

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

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

// client.query({
//   query: gql(tokensQuery)
// })
// .then(data => console.log("Subgraph data: ", data))
// .catch(err => { console.log("Error fetching data: ", err) });

export default client;
