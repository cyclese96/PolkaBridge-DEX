import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ResponsiveContainer } from "recharts";
import { AutoRow, RowBetween } from "../../../../common/Styled/Row";
import BarChart from "../Charts/BarChart";
import AreaChart from "../Charts/AreaChart";

import {
  // toK,
  // toNiceDate,
  // toNiceDateYear,
  formattedNum,
  getTimeframe,
} from "../../../../../utils/timeUtils";

// import { OptionButton } from "../../../../common/Styled/ButtonStyled";
// import { darken } from "polished";
import {
  usePairChartData,
  useHourlyRateData,
  usePairData,
} from "../../../../../contexts/PairData"; //'../../contexts/PairData'
import { timeframeOptions } from "../../../../../constants/index";
import { useMedia } from "react-use";
// import { EmptyCard } from '..'
import DropdownSelect from "../../../../common/Styled/DropdownSelect";
import CandleStickChart from "../../../../common/Styled/CandleChart";
import { Button } from "@material-ui/core";
// import LocalLoader from '../LocalLoader'
// import { useDarkModeManager } from '../../contexts/LocalStorage'

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 340px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`;

// const OptionsRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   width: 100%;
//   margin-bottom: 40px;
// `;

const CHART_VIEW = {
  VOLUME: "Volume",
  LIQUIDITY: "Liquidity",
  RATE0: "Price 0",
  RATE1: "Price 1",
};

const PairChart = ({ address, color, base0, base1 }) => {
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.LIQUIDITY);

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.MONTH);

  // const [darkMode, setDarkMode] = useState(true);
  // const textColor = darkMode ? "white" : "black";

  // update the width on a window resize
  const ref = useRef();
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth);
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight);
  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width);
      setHeight(ref?.current?.container?.clientHeight ?? height);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height, isClient, width]); // Empty array ensures that effect is only run on mount and unmount

  // get data for pair, and rates
  const pairData = usePairData(address);
  let chartData = usePairChartData(address);
  const hourlyData = useHourlyRateData(address, timeWindow);
  const hourlyRate0 = hourlyData && hourlyData[0];
  const hourlyRate1 = hourlyData && hourlyData[1];

  // useEffect(() => {
  //   // console.log("pair chart data page", chartData);
  // }, [chartData]);
  // formatted symbols for overflow
  const formattedSymbol0 =
    pairData?.token0?.symbol.length > 6
      ? pairData?.token0?.symbol.slice(0, 5) + "..."
      : pairData?.token0?.symbol;
  const formattedSymbol1 =
    pairData?.token1?.symbol.length > 6
      ? pairData?.token1?.symbol.slice(0, 5) + "..."
      : pairData?.token1?.symbol;

  const below1600 = useMedia("(max-width: 1600px)");
  const below1080 = useMedia("(max-width: 1080px)");
  const below600 = useMedia("(max-width: 600px)");

  let utcStartTime = getTimeframe(timeWindow);
  chartData = chartData?.filter((entry) => entry.date >= utcStartTime);

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <div>No historical data yet.</div>{" "}
      </ChartWrapper>
    );
  }

  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val) {
    if (chartFilter === CHART_VIEW.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
      );
    }
    if (chartFilter === CHART_VIEW.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
      );
    }
  }

  const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22;

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
            color={"#000000"}
          />
        </RowBetween>
      ) : (
        <div>
          <div className="d-flex justify-content-center ">
            <Button
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME);
                setChartFilter(CHART_VIEW.LIQUIDITY);
              }}
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
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME);
                setChartFilter(CHART_VIEW.VOLUME);
              }}
              style={
                chartFilter === CHART_VIEW.VOLUME
                  ? styles.buttonActive
                  : styles.button
              }
            >
              Volume
            </Button>
            <Button
              active={chartFilter === CHART_VIEW.RATE0}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK);
                setChartFilter(CHART_VIEW.RATE0);
              }}
              style={
                chartFilter === CHART_VIEW.RATE0
                  ? styles.buttonActive
                  : styles.button
              }
            >
              {pairData.token0
                ? formattedSymbol1 + "/" + formattedSymbol0
                : "-"}
            </Button>
            <Button
              active={chartFilter === CHART_VIEW.RATE1}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK);
                setChartFilter(CHART_VIEW.RATE1);
              }}
              style={
                chartFilter === CHART_VIEW.RATE1
                  ? styles.buttonActive
                  : styles.button
              }
            >
              {pairData.token0
                ? formattedSymbol0 + "/" + formattedSymbol1
                : "-"}
            </Button>
          </div>
          <AutoRow justify="flex-end" gap="6px">
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
      {chartFilter === CHART_VIEW.LIQUIDITY && chartData && (
        <ResponsiveContainer aspect={aspect}>
          {/* <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
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
              tickMargin={14}
              minTickGap={80}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={(tick) => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tickMargin={16}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color,
                color: 'black',
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={' (USD)'}
              dataKey={'reserveUSD'}
              yAxisId={0}
              stroke={darken(0.12, color)}
              fill="url(#colorUv)"
            />
          </AreaChart> */}
          <AreaChart chartData={chartData} />
        </ResponsiveContainer>
      )}

      {chartFilter === CHART_VIEW.RATE1 &&
        (hourlyRate1 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate1}
              base={base0}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          <div>Loading...</div>
        ))}

      {chartFilter === CHART_VIEW.RATE0 &&
        (hourlyRate0 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate0}
              base={base1}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          <div>Loading...</div>
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          {/* <BarChart
            margin={{ top: 0, right: 0, bottom: 6, left: below1080 ? 0 : 10 }}
            barCategoryGap={1}
            data={chartData}
          >
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={(tick) => '$' + toK(tick)}
              tickLine={false}
              interval="preserveEnd"
              orientation="right"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={{ fill: color, opacity: 0.1 }}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color,
                color: 'black',
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Bar
              type="monotone"
              name={'Volume'}
              dataKey={'dailyVolumeUSD'}
              fill={color}
              opacity={'0.4'}
              yAxisId={0}
              stroke={color}
            />
          </BarChart> */}

          <BarChart chartData={chartData} />
        </ResponsiveContainer>
      )}
    </ChartWrapper>
  );
};

export default PairChart;
