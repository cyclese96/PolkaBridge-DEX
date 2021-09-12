import gql from 'graphql-tag'
import { BUNDLE_ID, currentConnection, facotryAddressTestnet, factoryAddresMainnet } from "../constants";
import { getUnixTime } from "../utils/helper";
import { client } from "./client";

const FACTORY_ADDRESS = currentConnection === 'testnet' ? facotryAddressTestnet : factoryAddresMainnet;

export const testQuery = async () => {
  const queryObj = `
    query {
        depositEntities(first: 5) {
          id
          fromAccount
          amount
          depositedAt
        }
      }
    `;

  const res = await client.query({ query: gql(queryObj) });

  console.log(res.data);
};

export const getTopTokens = async (page = 1) => {
  const items = page * 10;
  const skips = page * 10 - 10;

  try {

    const queryObj = `
    query {
        tokens(first: ${items}, skip: ${skips} ) {
          id
          name
          symbol
          tradeVolume
          tradeVolumeUSD
          totalLiquidity
          derivedETH
        }
     }
    `;

    const res = await client.query({ query: gql(queryObj) });
    return res.data.tokens

  } catch (error) {
    console.log('getTopTokens', error)
    return []
  }


};

// top pools based on reserved ETH in the pool
export const topPools = async (order = "desc", page = 1) => {
  const items = 10 * page;
  const skips = 10 * page - 10;

  try {

    const queryObj = `
            query {
              pairs(first: ${items}, skip: ${skips}, orderBy: reserveETH orderDirection: ${order}){
              id
              token0 {
                symbol
              }
              token1 {
                symbol
              }
              reserveETH
              reserveUSD
            }
          }
    `
    const res = await client.query({ query: gql(queryObj) })
    return res.data.pairs
  } catch (error) {
    return []
  }

}


// pair volume 24: pairDayData(pairId, 1 )
// pair volume 7d pairDayData(pairId, 7 )
export const pairDayData = async (pairId, days) => {

  const todayUnixTime = getUnixTime(0);


  try {
    const queryObj =
      ` 
          query {
            pairDayDatas(first: ${days}, orderBy: date, orderDirection: desc,
              where: {
                pairAddress: "${pairId}",
                date_lt: ${todayUnixTime}
              }
            ) {
                date
                dailyVolumeToken0
                dailyVolumeToken1
                dailyVolumeUSD
                reserveUSD
            }
          }
      `
    const res = await client.query({ query: gql(queryObj) });
    return res.data.pairDayDatas;

  } catch (error) {
    return []
  }

}

// PolkabridgeAmmDailyData

export const polkabridgeAmmDailyData = async (days = 128) => {

  try {
    const queryObj = `
      query {
        polkabridgeAmmDayDatas (first: 7, orderBy: date orderDirection: desc ) {
            date
            dailyVolumeETH
            dailyVolumeUSD
            totalVolumeETH
            totalLiquidityETH
            totalLiquidityUSD
            txCount
          }
          }
    
    `
    const res = await client.query({ query: gql(queryObj) });
    return res.data.polkabridgeAmmDayDatas;
  } catch (error) {
    return []
  }
}


export const GLOBAL_CHART = gql`
  query polkabridgeAmmDayDatas($startTime: Int!, $skip: Int!) {
    polkabridgeAmmDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      id
      date
      totalVolumeUSD
      dailyVolumeUSD
      dailyVolumeETH
      totalLiquidityUSD
      totalLiquidityETH
    }
  }
`

export const GLOBAL_DATA = (block) => {
  const queryString = ` query polkabridgeAmmFactories {
    polkabridgeAmmFactories(
       ${block ? `block: { number: ${block}}` : ``} 
       where: { id: "${FACTORY_ADDRESS}" }) {
        id
        totalVolumeUSD
        totalVolumeETH
        untrackedVolumeUSD
        totalLiquidityUSD
        totalLiquidityETH
        txCount
        pairCount
      }
    }`
  return gql(queryString)
}

// export const GLOBAL_TXNS =

export const topTransactions = async (page = 1, order = 'desc') => {

  try {

    const items = 60 * page;
    const skips = 60 * page - 60;

    const displayOrder = order;

    const queryObj = `
    query transactions   {
      transactions(first: ${items}, skip: ${skips},  orderBy: timestamp, orderDirection: ${displayOrder}) {
        mints(orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
            timestamp
          }
          sender
          pair {
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
          to
          liquidity
          amount0
          amount1
          amountUSD
        }
        burns(orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
            timestamp
          }
          sender
          pair {
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
          sender
          liquidity
          amount0
          amount1
          amountUSD
        }
        swaps(orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
            timestamp
          }
          sender
          pair {
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
          amount0In
          amount0Out
          amount1In
          amount1Out
          amountUSD
          to
        }
      }
    }
  `

    const res = await client.query({ query: gql(queryObj) });
    console.log('res', res.data)
    return res.data.transactions;
  } catch (error) {
    return []
  }
}

// queries global data context

export const ALL_PAIRS = gql`
  query pairs($skip: Int!) {
    pairs(first: 500, skip: $skip, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`


export const ALL_TOKENS = gql`
  query tokens($skip: Int!) {
    tokens(first: 500, skip: $skip) {
      id
      name
      symbol
      totalLiquidity
    }
  }
`

export const ETH_PRICE = (block) => {
  const _block = block//9278400
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${BUNDLE_ID} } block: {number: ${_block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${BUNDLE_ID} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}



export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
      } }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const SUBGRAPH_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "uniswap/uniswap-v2") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`