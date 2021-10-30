// import React from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { useState } from "react/cjs/react.development";
import { usePrevious } from "react-use";

const chartEvent = (
  event,
  chartConfig,
  { seriesIndex, dataPointIndex, config }
) => {
  if (dataPointIndex < 0) {
    return;
  } else {
    console.log("click on data ", dataPointIndex);
  }
};

const state = {
  options: {
    chart: {
      id: "chart2",
      type: "area",
      height: 300,
      foreColor: "#ccc",

      toolbar: {
        show: false,
      },
      events: {
        mouseMove: chartEvent,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#E0077D"],
    grid: {
      borderColor: "#212121",
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tickAmount: 3,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {},
      theme: "dark",
    },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
  },

  selection: "all",
  series: [
    {
      name: "TVL USD",
      data: [],
    },
  ],
};

const AreaChart = ({ chartData }) => {
  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false);
  const dataPrev = usePrevious(chartData);
  const [currChartData, setChartData] = useState(state.series);

  useEffect(() => {
    if (chartData !== dataPrev && chartData) {
      const _data =
        chartData.length > 0
          ? chartData.map((item) => [
              item.date * 1000,
              item.totalLiquidityUSD || item.reserveUSD
                ? parseInt(item.totalLiquidityUSD || item.reserveUSD)
                : 0,
            ])
          : [];

      console.log("area chart data  ", currChartData);
      setChartData([{ name: currChartData[0].name, data: _data }]);
    }
  }, [chartCreated, chartData, dataPrev]);

  return (
    <Chart
      options={state.options}
      series={currChartData}
      type="area"
      height="100%"
    />
  );
};

export default AreaChart;
