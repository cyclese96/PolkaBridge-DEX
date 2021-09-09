import { gql } from "@apollo/client";
import { getUnixTime } from "../utils/helper";
import client from "./client";

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
          uniswapDayDatas (first: 7, orderBy: date orderDirection: desc ) {
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
    return res.data.uniswapDayDatas;
  } catch (error) {
    return []
  }
}