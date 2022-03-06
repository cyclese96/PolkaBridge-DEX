// import React from "react";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { usePrevious } from "react-use";
// import CurrencyFormat from "react-currency-format";
import { formatCurrency } from "../../../../../utils/formatters";

// const chartEvent = (
//   event,
//   chartConfig,
//   { seriesIndex, dataPointIndex, config }
// ) => {
//   if (dataPointIndex < 0) {
//     return;
//   } else {
//     // console.log("click on data ", dataPointIndex);
//   }
// };

const AreaChart = ({ chartData, chartType }) => {
  let state = {
    options: {
      chart: {
        id: "chart2",
        type: "area",
        height: 300,
        foreColor: "#212121",

        toolbar: {
          show: false,
        },
        events: {
          mouseMove: () => {},
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
        labels: {
          formatter: function (value) {
            return formatCurrency(value);
          },
        },
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
        name: chartType === "price" ? "Price USD" : "TVL USD",
        data: [],
      },
    ],
  };

  // pointer to the chart object
  const chartCreated = false;
  // const [chartCreated, setChartCreated] = useState(false);
  const dataPrev = usePrevious(chartData);
  const [currChartData, setChartData] = useState(state.series);

  const currentChartDataPoint = (item, type) => {
    if (type === "price") {
      return [item.date, item.priceUSD];
    }
    return [
      item.date * 1000,
      item.totalLiquidityUSD || item.reserveUSD
        ? parseInt(item.totalLiquidityUSD || item.reserveUSD)
        : 0,
    ];
  };
  useEffect(() => {
    // console.log("chart data ", { chartData, chartType });
    if (chartData !== dataPrev && chartData) {
      const _data =
        chartData.length > 0
          ? chartData.map((item) => currentChartDataPoint(item, chartType))
          : [];

      // console.log("area chart data  ", currChartData);
      setChartData([{ name: currChartData[0].name, data: _data }]);
    }
  }, [chartCreated, chartData, dataPrev, chartType, currChartData]);

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
