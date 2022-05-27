import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { client, clients } from "../apollo/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useTimeframe } from "./Application";
import {
  getPercentChange,
  getBlockFromTimestamp,
  getBlocksFromTimestamps,
  get2DayPercentChange,
  getTimeframe,
} from "../utils/timeUtils";
import {
  GLOBAL_DATA,
  GLOBAL_TXNS,
  GLOBAL_CHART,
  ETH_PRICE,
  ALL_PAIRS,
  ALL_TOKENS,
  TOKEN_DATA,
  TOKEN_CURRENT_DATA,
  // TOP_LPS_PER_PAIRS,
} from "../apollo/queries";
import weekOfYear from "dayjs/plugin/weekOfYear";
// import { useAllPairData } from './PairData'
import { useTokenChartDataCombined } from "./TokenData";
import { useSelector } from "react-redux";
const UPDATE = "UPDATE";
const UPDATE_TXNS = "UPDATE_TXNS";
const UPDATE_CHART = "UPDATE_CHART";
const UPDATE_ETH_PRICE = "UPDATE_ETH_PRICE";
const ETH_PRICE_KEY = "ETH_PRICE_KEY";
const UPDATE_ALL_PAIRS_IN_UNISWAP =
  "UPDAUPDATE_ALL_PAIRS_IN_UNISWAPTE_TOP_PAIRS";
const UPDATE_ALL_TOKENS_IN_UNISWAP = "UPDATE_ALL_TOKENS_IN_UNISWAP";
const UPDATE_TOP_LPS = "UPDATE_TOP_LPS";

const offsetVolumes = [];

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

const GlobalDataContext = createContext();

function useGlobalDataContext() {
  return useContext(GlobalDataContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { data } = payload;
      return {
        ...state,
        globalData: data,
      };
    }
    case UPDATE_TXNS: {
      const { transactions } = payload;
      return {
        ...state,
        transactions,
      };
    }
    case UPDATE_CHART: {
      const { daily, weekly } = payload;
      return {
        ...state,
        chartData: {
          daily,
          weekly,
        },
      };
    }
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload;
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange,
      };
    }

    case UPDATE_ALL_PAIRS_IN_UNISWAP: {
      const { allPairs } = payload;
      return {
        ...state,
        allPairs,
      };
    }

    case UPDATE_ALL_TOKENS_IN_UNISWAP: {
      const { allTokens } = payload;
      return {
        ...state,
        allTokens,
      };
    }

    case UPDATE_TOP_LPS: {
      const { topLps } = payload;
      return {
        ...state,
        topLps,
      };
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {});
  const update = useCallback((data) => {
    dispatch({
      type: UPDATE,
      payload: {
        data,
      },
    });
  }, []);

  const updateTransactions = useCallback((transactions) => {
    dispatch({
      type: UPDATE_TXNS,
      payload: {
        transactions,
      },
    });
  }, []);

  const updateChart = useCallback((daily, weekly) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        daily,
        weekly,
      },
    });
  }, []);

  const updateEthPrice = useCallback(
    (ethPrice, oneDayPrice, ethPriceChange) => {
      dispatch({
        type: UPDATE_ETH_PRICE,
        payload: {
          ethPrice,
          oneDayPrice,
          ethPriceChange,
        },
      });
    },
    []
  );

  const updateAllPairsInUniswap = useCallback((allPairs) => {
    dispatch({
      type: UPDATE_ALL_PAIRS_IN_UNISWAP,
      payload: {
        allPairs,
      },
    });
  }, []);

  const updateAllTokensInUniswap = useCallback((allTokens) => {
    dispatch({
      type: UPDATE_ALL_TOKENS_IN_UNISWAP,
      payload: {
        allTokens,
      },
    });
  }, []);

  const updateTopLps = useCallback((topLps) => {
    dispatch({
      type: UPDATE_TOP_LPS,
      payload: {
        topLps,
      },
    });
  }, []);
  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTransactions,
            updateChart,
            updateEthPrice,
            updateTopLps,
            updateAllPairsInUniswap,
            updateAllTokensInUniswap,
          },
        ],
        [
          state,
          update,
          updateTransactions,
          updateTopLps,
          updateChart,
          updateEthPrice,
          updateAllPairsInUniswap,
          updateAllTokensInUniswap,
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}

/**
 * Gets all the global data for the overview page.
 * Needs current eth price and the old eth price to get
 * 24 hour USD changes.
 * @param {*} ethPrice
 * @param {*} oldEthPrice
 */

async function getGlobalData(ethPrice, oldEthPrice, chainId = 1) {
  // data for each day , historic data used for % changes
  let data = {};
  let oneDayData = {};
  let twoDayData = {};

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs();
    const utcOneDayBack = utcCurrentTime.subtract(1, "day").unix();
    const utcTwoDaysBack = utcCurrentTime.subtract(2, "day").unix();
    const utcOneWeekBack = utcCurrentTime.subtract(1, "week").unix();
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, "week").unix();

    // get the blocks needed for time travel queries
    let [oneDayBlock, twoDayBlock, oneWeekBlock, twoWeekBlock] =
      await getBlocksFromTimestamps(
        [utcOneDayBack, utcTwoDaysBack, utcOneWeekBack, utcTwoWeeksBack],
        chainId
      );

    // fetch the global data
    let result = await clients?.[chainId]?.query({
      query: GLOBAL_DATA(),
      fetchPolicy: "cache-first",
    });

    data = !result?.data?.polkabridgeAmmFactories[0]
      ? {}
      : result?.data?.polkabridgeAmmFactories[0];

    // fetch the historical data
    let oneDayResult = await clients?.[chainId]?.query({
      query: GLOBAL_DATA(oneDayBlock?.number),
      fetchPolicy: "cache-first",
    });

    oneDayData = !oneDayResult?.data?.polkabridgeAmmFactories[0]
      ? {}
      : oneDayResult?.data?.polkabridgeAmmFactories[0];

    let twoDayResult = await clients?.[chainId]?.query({
      query: GLOBAL_DATA(twoDayBlock?.number),
      fetchPolicy: "cache-first",
    });

    twoDayData = !twoDayResult?.data?.polkabridgeAmmFactories[0]
      ? {}
      : twoDayResult?.data?.polkabridgeAmmFactories[0];

    let oneWeekResult = await clients?.[chainId]?.query({
      query: GLOBAL_DATA(oneWeekBlock?.number),
      fetchPolicy: "cache-first",
    });
    const oneWeekData = !oneWeekResult?.data?.polkabridgeAmmFactories[0]
      ? {}
      : oneWeekResult?.data?.polkabridgeAmmFactories[0];

    let twoWeekResult = await clients?.[chainId]?.query({
      query: GLOBAL_DATA(twoWeekBlock?.number),
      fetchPolicy: "cache-first",
    });

    const twoWeekData = !twoWeekResult?.data?.polkabridgeAmmFactories[0]
      ? {}
      : twoWeekResult?.data?.polkabridgeAmmFactories[0];

    if (data && oneDayData && twoDayData && twoWeekData) {
      let [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData.totalVolumeUSD,
        twoDayData.totalVolumeUSD
      );

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData.totalVolumeUSD,
        twoWeekData.totalVolumeUSD
      );

      const [oneDayTxns, txnChange] = get2DayPercentChange(
        data.txCount,
        oneDayData.txCount ? oneDayData.txCount : 0,
        twoDayData.txCount ? twoDayData.txCount : 0
      );

      // format the total liquidity in USD
      data.totalLiquidityUSD = data.totalLiquidityETH * ethPrice;
      const liquidityChangeUSD = getPercentChange(
        data.totalLiquidityETH * ethPrice,
        oneDayData.totalLiquidityETH * oldEthPrice
      );

      // add relevant fields with the calculated amounts
      data.oneDayVolumeUSD = oneDayVolumeUSD;
      data.oneWeekVolume = oneWeekVolume;
      data.weeklyVolumeChange = weeklyVolumeChange;
      data.volumeChangeUSD = volumeChangeUSD;
      data.liquidityChangeUSD = liquidityChangeUSD;
      data.oneDayTxns = oneDayTxns;
      data.txnChange = txnChange;
    }
  } catch (e) {
    console.log("analyticsTest global data exeption ", e);
  }

  return data;
}

/**
 * Get historical data for volume and liquidity used in global charts
 * on main page
 * @param {*} oldestDateToFetch // start of window to fetch from
 */

let checked = false;

const getChartData = async (oldestDateToFetch, offsetData, chainId = 1) => {
  let data = [];
  let weeklyData = [];
  const utcEndTime = dayjs.utc();
  let skip = 0;
  let allFound = false;

  try {
    while (!allFound) {
      let result = await clients?.[chainId]?.query({
        query: GLOBAL_CHART,
        variables: {
          startTime: oldestDateToFetch,
          skip,
        },
        fetchPolicy: "cache-first",
      });
      skip += 1000;
      data = data.concat(result.data.polkabridgeAmmDayDatas);
      if (result.data.polkabridgeAmmDayDatas.length < 1000) {
        allFound = true;
      }
    }

    if (data) {
      let dayIndexSet = new Set();
      let dayIndexArray = [];
      const oneDay = 24 * 60 * 60;

      // for each day, parse the daily volume and format for chart array
      data.forEach((dayData, i) => {
        // add the day index to the set of days
        dayIndexSet.add((data[i].date / oneDay).toFixed(0));
        dayIndexArray.push(data[i]);
        dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD);
      });

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch;
      let latestLiquidityUSD = data[0].totalLiquidityUSD;
      let latestDayDats = data[0].mostLiquidTokens;
      let index = 1;
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay;
        let currentDayIndex = (nextDay / oneDay).toFixed(0);

        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            // id: nextDay.toString(), //: todo fix
            date: nextDay,
            dailyVolumeUSD: 0,
            totalLiquidityUSD: latestLiquidityUSD,
            mostLiquidTokens: latestDayDats,
          });
        } else {
          latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD;
          latestDayDats = dayIndexArray[index].mostLiquidTokens;
          index = index + 1;
        }
        timestamp = nextDay;
      }
    }

    // format weekly data for weekly sized chunks
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1));
    let startIndexWeekly = -1;
    let currentWeek = -1;

    data.forEach((entry, i) => {
      const date = data[i].date;

      // hardcoded fix for offset volume
      offsetData &&
        !checked &&
        offsetData.map((dayData) => {
          if (dayData[date]) {
            data[i].dailyVolumeUSD =
              parseFloat(data[i].dailyVolumeUSD) -
              parseFloat(dayData[date].dailyVolumeUSD);
          }
          return true;
        });

      const week = dayjs.utc(dayjs.unix(data[i].date)).week();
      if (week !== currentWeek) {
        currentWeek = week;
        startIndexWeekly++;
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {};
      weeklyData[startIndexWeekly].date = data[i].date;
      weeklyData[startIndexWeekly].weeklyVolumeUSD =
        (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) +
        data[i].dailyVolumeUSD;
    });

    if (!checked) {
      checked = true;
    }
  } catch (e) {
    console.log(e);
  }
  // console.log('chart daily data', data)
  // console.log('weekly ', weeklyData)
  return [data, weeklyData];
};

/**
 * Get and format transactions for global page
 */
const getGlobalTransactions = async (chainId = 1) => {
  let transactions = {};

  try {
    let result = await clients?.[chainId]?.query({
      query: GLOBAL_TXNS,
      fetchPolicy: "cache-first",
    });
    transactions.mints = [];
    transactions.burns = [];
    transactions.swaps = [];
    result?.data?.transactions &&
      result.data.transactions.map((transaction) => {
        if (transaction.mints.length > 0) {
          transaction.mints.map((mint) => {
            return transactions.mints.push(mint);
          });
        }
        if (transaction.burns.length > 0) {
          transaction.burns.map((burn) => {
            return transactions.burns.push(burn);
          });
        }
        if (transaction.swaps.length > 0) {
          transaction.swaps.map((swap) => {
            return transactions.swaps.push(swap);
          });
        }
        return true;
      });
  } catch (e) {
    console.log(e);
  }

  return transactions;
};

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
const getEthPrice = async (chainId = 1) => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime
    .subtract(1, "day")
    .startOf("minute")
    .unix();

  let ethPrice = 0;
  let ethPriceOneDay = 0;
  let priceChangeETH = 0;

  try {
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, chainId);
    let result = await clients?.[chainId]?.query({
      query: ETH_PRICE(),
      fetchPolicy: "cache-first",
    });
    let resultOneDay = await clients?.[chainId]?.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: "cache-first",
    });
    const currentPrice = result?.data?.bundles[0]?.ethPrice;
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice;
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice);
    ethPrice = currentPrice;
    ethPriceOneDay = oneDayBackPrice;
  } catch (e) {
    console.log("getEthPrice", e);
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH];
};

const PAIRS_TO_FETCH = 500;
const TOKENS_TO_FETCH = 500;

/**
 * Loop through every pair on uniswap, used for search
 */
async function getAllPairsOnUniswap(chainId = 1) {
  try {
    let allFound = false;
    let pairs = [];
    let skipCount = 0;
    while (!allFound) {
      let result = await clients?.[chainId]?.query({
        query: ALL_PAIRS,
        variables: {
          skip: skipCount,
        },
        fetchPolicy: "cache-first",
      });
      skipCount = skipCount + PAIRS_TO_FETCH;
      pairs = pairs.concat(result?.data?.pairs);
      if (
        result?.data?.pairs.length < PAIRS_TO_FETCH ||
        pairs.length > PAIRS_TO_FETCH
      ) {
        allFound = true;
      }
    }
    return pairs;
  } catch (e) {
    console.log("getAllPairsOnUniswap", e);
  }
}

/**
 * Loop through every token on uniswap, used for search
 */
async function getAllTokensOnUniswap(chainId = 1) {
  try {
    let allFound = false;
    let skipCount = 0;
    let tokens = [];
    while (!allFound) {
      let result = await clients?.[chainId]?.query({
        query: ALL_TOKENS,
        variables: {
          skip: skipCount,
        },
        fetchPolicy: "cache-first",
      });
      tokens = tokens.concat(result?.data?.tokens);
      if (
        result?.data?.tokens?.length < TOKENS_TO_FETCH ||
        tokens.length > TOKENS_TO_FETCH
      ) {
        allFound = true;
      }
      skipCount = skipCount += TOKENS_TO_FETCH;
    }
    return tokens;
  } catch (e) {
    console.log("getAllTokensOnUniswap", e);
  }
}

/**
 * Hook that fetches overview data, plus all tokens and pairs for search
 */
export function useGlobalData() {
  const [state, { update, updateAllPairsInUniswap, updateAllTokensInUniswap }] =
    useGlobalDataContext();
  const [ethPrice, oldEthPrice] = useEthPrice();

  const data = state?.globalData;

  const selectedChain = useSelector((state) => state.account?.currentChain);

  // const combinedVolume = useTokenDataCombined(offsetVolumes)

  useEffect(() => {
    async function fetchData() {
      let globalData = await getGlobalData(
        ethPrice,
        oldEthPrice,
        selectedChain
      );

      globalData && update(globalData);

      let allPairs = await getAllPairsOnUniswap(selectedChain);
      updateAllPairsInUniswap(allPairs);

      let allTokens = await getAllTokensOnUniswap(selectedChain);
      updateAllTokensInUniswap(allTokens);
    }
    // if (!data && ethPrice && oldEthPrice) {
    //   fetchData();
    // }
    if (!data && ethPrice) {
      fetchData();
    }
  }, [
    ethPrice,
    oldEthPrice,
    update,
    data,
    updateAllPairsInUniswap,
    updateAllTokensInUniswap,
    selectedChain,
  ]);

  return data || null;
}

export function useGlobalChartData() {
  const [state, { updateChart }] = useGlobalDataContext();
  const [oldestDateFetch, setOldestDateFetched] = useState();
  const [activeWindow] = useTimeframe();

  const chartDataDaily = state?.chartData?.daily;
  const chartDataWeekly = state?.chartData?.weekly;

  const selectedChain = useSelector((state) => state.account?.currentChain);

  /**
   * Keep track of oldest date fetched. Used to
   * limit data fetched until its actually needed.
   * (dont fetch year long stuff unless year option selected)
   */
  useEffect(() => {
    // based on window, get starttime
    let startTime = getTimeframe(activeWindow);

    if ((activeWindow && startTime < oldestDateFetch) || !oldestDateFetch) {
      setOldestDateFetched(startTime);
    }
  }, [activeWindow, oldestDateFetch]);

  // fix for rebass tokens

  const combinedData = useTokenChartDataCombined(offsetVolumes);

  /**
   * Fetch data if none fetched or older data is needed
   */
  useEffect(() => {
    async function fetchData() {
      // historical stuff for chart
      let [newChartData, newWeeklyData] = await getChartData(
        oldestDateFetch,
        combinedData,
        selectedChain
      );
      updateChart(newChartData, newWeeklyData);
    }
    if (
      oldestDateFetch &&
      !(chartDataDaily && chartDataWeekly) &&
      combinedData
    ) {
      fetchData();
    }
  }, [
    chartDataDaily,
    chartDataWeekly,
    combinedData,
    oldestDateFetch,
    updateChart,
    selectedChain,
  ]);

  return [chartDataDaily, chartDataWeekly];
}

export function useGlobalTransactions() {
  const [state, { updateTransactions }] = useGlobalDataContext();
  const transactions = state?.transactions;

  const selectedChain = useSelector((state) => state.account?.currentChain);

  useEffect(() => {
    async function fetchData() {
      if (!transactions) {
        let txns = await getGlobalTransactions(selectedChain);
        updateTransactions(txns);
      }
    }
    fetchData();
  }, [updateTransactions, transactions, selectedChain]);
  return transactions;
}

export function useEthPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext();
  const ethPrice = state?.[ETH_PRICE_KEY];
  const ethPriceOld = state?.["oneDayPrice"];

  const selectedChain = useSelector((state) => state.account?.currentChain);

  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        let [newPrice, oneDayPrice, priceChange] = await getEthPrice(
          selectedChain
        );
        updateEthPrice(newPrice, oneDayPrice, priceChange);
      }
    }
    checkForEthPrice();
  }, [ethPrice, updateEthPrice, selectedChain]);

  return [ethPrice, ethPriceOld];
}
