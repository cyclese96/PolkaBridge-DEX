import React, { useState, useRef, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import { AutoRow, RowBetween } from "../../../../common/Styled/Row";
import BarChart from "../Charts/BarChart";
import AreaChart from "../Charts/AreaChart";
import styled from "styled-components";

import { getTimeframe } from "../../../../../utils/timeUtils";

import { useMedia, usePrevious } from "react-use";
import { timeframeOptions } from "../../../../../constants/index";
import {
  useTokenChartData,
  useTokenPriceData,
} from "../../../../../contexts/TokenData";
import CandleStickChart from "../../../../common/Styled/CandleChart";

import { Activity } from "react-feather";
import Loader from "../../../../common/Loader";
import { Button } from "@material-ui/core";
import DropdownSelect from "../../../../common/Styled/DropdownSelect";

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 340px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`;

const CHART_VIEW = {
  VOLUME: "Volume",
  LIQUIDITY: "Liquidity",
  PRICE: "Price",
  LINE_PRICE: "Price (Line)",
};

const DATA_FREQUENCY = {
  DAY: "DAY",
  HOUR: "HOUR",
  LINE: "LINE",
};

const styles = {
  button: {
    marginRight: 5,
    borderRadius: 7,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    border: "1px solid #616161",
    color: "black",
    backgroundColor: `#f9f9f9`,
  },
  buttonActive: {
    marginRight: 5,
    borderRadius: 7,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    border: "1px solid #f9057d",
    color: "#f9057d",
    backgroundColor: `transparent`,
  },
  chartContainer: {},
};
const TokenChart = ({ address, color, base }) => {
  // settings for the window and candle width
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.LIQUIDITY);
  const [frequency, setFrequency] = useState(DATA_FREQUENCY.DAY);

  // const [darkMode, setDarkMode] = useState(true);
  // const textColor = darkMode ? "white" : "black";

  // reset view on new address
  const addressPrev = usePrevious(address);
  useEffect(() => {
    if (address !== addressPrev && addressPrev) {
      setChartFilter(CHART_VIEW.LIQUIDITY);
    }
  }, [address, addressPrev]);

  let chartData = useTokenChartData(address);

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK);
  const prevWindow = usePrevious(timeWindow);

  // hourly and daily price data based on the current time window
  const hourlyWeek = useTokenPriceData(address, timeframeOptions.WEEK, 3600);
  const hourlyMonth = useTokenPriceData(address, timeframeOptions.MONTH, 3600);
  const hourlyAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 3600);
  const dailyWeek = useTokenPriceData(address, timeframeOptions.WEEK, 86400);
  const dailyMonth = useTokenPriceData(address, timeframeOptions.MONTH, 86400);
  const dailyAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 86400);

  const priceData =
    timeWindow === timeframeOptions.MONTH
      ? // monthly selected
        frequency === DATA_FREQUENCY.DAY
        ? dailyMonth
        : hourlyMonth
      : // weekly selected
      timeWindow === timeframeOptions.WEEK
      ? frequency === DATA_FREQUENCY.DAY
        ? dailyWeek
        : hourlyWeek
      : // all time selected
      frequency === DATA_FREQUENCY.DAY
      ? dailyAll
      : hourlyAll;

  // switch to hourly data when switched to week window
  useEffect(() => {
    if (
      timeWindow === timeframeOptions.WEEK &&
      prevWindow &&
      prevWindow !== timeframeOptions.WEEK
    ) {
      setFrequency(DATA_FREQUENCY.HOUR);
    }
  }, [prevWindow, timeWindow]);

  // switch to daily data if switche to month or all time view
  useEffect(() => {
    if (
      timeWindow === timeframeOptions.MONTH &&
      prevWindow &&
      prevWindow !== timeframeOptions.MONTH
    ) {
      setFrequency(DATA_FREQUENCY.DAY);
    }
    if (
      timeWindow === timeframeOptions.ALL_TIME &&
      prevWindow &&
      prevWindow !== timeframeOptions.ALL_TIME
    ) {
      setFrequency(DATA_FREQUENCY.DAY);
    }
  }, [prevWindow, timeWindow]);

  const below1080 = useMedia("(max-width: 1080px)");
  const below600 = useMedia("(max-width: 600px)");

  let utcStartTime = getTimeframe(timeWindow);
  // const domain = [
  //   (dataMin) => (dataMin > utcStartTime ? dataMin : utcStartTime),
  //   "dataMax",
  // ];
  const aspect = below1080 ? 60 / 32 : below600 ? 60 / 42 : 60 / 22;

  chartData = chartData?.filter((entry) => entry.date >= utcStartTime);

  // update the width on a window resize
  const ref = useRef();
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth);
  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, width]); // Empty array ensures that effect is only run on mount and unmount

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <DropdownSelect
            options={CHART_VIEW}
            active={chartFilter}
            setActive={setChartFilter}
            color={color}
          />
          <DropdownSelect
            options={timeframeOptions}
            active={timeWindow}
            setActive={setTimeWindow}
            color={color}
          />
        </RowBetween>
      ) : (
        <div>
          <div className="d-flex justify-content-center ">
            <Button
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => setChartFilter(CHART_VIEW.LIQUIDITY)}
              style={
                chartFilter === CHART_VIEW.LIQUIDITY
                  ? styles.buttonActive
                  : styles.button
              }
            >
              Liquidity
            </Button>
            <Button
              active={chartFilter === CHART_VIEW.VOLUME}
              onClick={() => setChartFilter(CHART_VIEW.VOLUME)}
              style={
                chartFilter === CHART_VIEW.VOLUME
                  ? styles.buttonActive
                  : styles.button
              }
            >
              Volume
            </Button>
            <Button
              active={chartFilter === CHART_VIEW.PRICE}
              onClick={() => {
                // console.log("analyticsTest: filter", CHART_VIEW.PRICE);
                setChartFilter(CHART_VIEW.PRICE);
              }}
              style={
                chartFilter === CHART_VIEW.PRICE
                  ? styles.buttonActive
                  : styles.button
              }
            >
              Price
            </Button>
          </div>
          {chartFilter === CHART_VIEW.PRICE && (
            <AutoRow gap="4px">
              {/* <Button
                active={frequency === DATA_FREQUENCY.DAY}
                onClick={() => {
                  setTimeWindow(timeframeOptions.MONTH);
                  setFrequency(DATA_FREQUENCY.DAY);
                }}
                style={styles.button}
              >
                D
              </Button>
              <Button
                active={frequency === DATA_FREQUENCY.HOUR}
                onClick={() => setFrequency(DATA_FREQUENCY.HOUR)}
                style={styles.button}
              >
                H
              </Button> */}
              <Button
                active={frequency === DATA_FREQUENCY.LINE}
                onClick={() => setFrequency(DATA_FREQUENCY.LINE)}
                style={
                  frequency === DATA_FREQUENCY.LINE
                    ? styles.buttonActive
                    : styles.button
                }
              >
                <Activity size={14} />
              </Button>
            </AutoRow>
          )}

          <AutoRow justify="flex-end" gap="6px" align="flex-start">
            <Button
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
              style={styles.button}
            >
              1W
            </Button>
            <Button
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
              style={styles.button}
            >
              1M
            </Button>
            <Button
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
              style={styles.button}
            >
              All
            </Button>
          </AutoRow>
        </div>
      )}

      {/* </RowBetween> */}

      {chartFilter === CHART_VIEW.LIQUIDITY && chartData && (
        <AreaChart chartData={chartData} />
      )}
      {chartFilter === CHART_VIEW.PRICE &&
        (frequency === DATA_FREQUENCY.LINE ? (
          <ResponsiveContainer aspect={below1080 ? 60 / 32 : 60 / 16}>
            {/* <AreaChartNative
              margin={{ top: 0, right: 10, bottom: 6, left: 0 }}
              barCategoryGap={1}
              data={chartData}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                tickLine={false}
                axisLine={false}
                interval="preserveEnd"
                tickMargin={16}
                minTickGap={120}
                tickFormatter={(tick) => toNiceDate(tick)}
                dataKey="date"
                tick={{ fill: textColor }}
                type={"number"}
                domain={domain}
              />
              <YAxis
                type="number"
                orientation="right"
                tickFormatter={(tick) => "$" + toK(tick)}
                axisLine={false}
                tickLine={false}
                interval="preserveEnd"
                minTickGap={80}
                yAxisId={0}
                tick={{ fill: textColor }}
              />
              <Tooltip
                cursor={true}
                formatter={(val) => formattedNum(val, true)}
                labelFormatter={(label) => toNiceDateYear(label)}
                labelStyle={{ paddingTop: 4 }}
                contentStyle={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  borderColor: color,
                  color: "black",
                }}
                wrapperStyle={{ top: -70, left: -10 }}
              />
              <Area
                key={"other"}
                dataKey={"priceUSD"}
                stackId="2"
                strokeWidth={2}
                dot={false}
                type="monotone"
                name={"Price"}
                yAxisId={0}
                stroke={darken(0.12, color)}
                fill="url(#colorUv)"
              />
            </AreaChartNative> */}
            <AreaChart chartData={chartData} chartType="price" />
          </ResponsiveContainer>
        ) : priceData ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart data={priceData} width={width} base={base} />
          </ResponsiveContainer>
        ) : (
          <div className="text-center">
            <Loader />
          </div>
        ))}

      {chartFilter === CHART_VIEW.VOLUME && <BarChart chartData={chartData} />}
    </ChartWrapper>
  );
};

export default TokenChart;
