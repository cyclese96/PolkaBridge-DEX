// import React from "react";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { usePrevious } from "react-use";
import { formatCurrency } from "../../../../../utils/formatters";

// const chartEvent = (
//   event,
//   chartConfig,
//   { seriesIndex, dataPointIndex, config }
// ) => {
//   if (dataPointIndex < 0) {
//     return;
//   } else {
//     console.log("click on data ", dataPointIndex);
//   }
// };

const state = {
  options: {
    chart: {
      id: "bar",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
      events: {
        mouseMove: () => {},
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    legend: {
      show: false,
    },
    colors: ["#E0077D"],

    grid: {
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
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#212121",
        },
      },
      style: {
        colors: "white",
      },
      // min: new Date("10 Aug 2021").getTime(),
      tickAmount: 8,
      color: "white",
    },
    yaxis: {
      tickAmount: 3,
      // labels: {
      //   style: {
      //     colors: "#bdbdbd",
      //   },
      // },
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
      name: "Volume(US$)",
      data: [],
    },
  ],
};
const BarChart = ({ chartData }) => {
  // pointer to the chart object
  const chartCreated = false;
  // const [chartCreated, setChartCreated] = useState(false);
  const dataPrev = usePrevious(chartData);
  const [currChartData, setChartData] = useState(state.series);

  useEffect(() => {
    if (chartData !== dataPrev && chartData) {
      // console.log(chartData);
      const _series =
        chartData.length > 0
          ? chartData.map((item) => [
              item.date * 1000,
              item.dailyVolumeUSD ? parseInt(item.dailyVolumeUSD) : 0,
            ])
          : [];
      setChartData([{ name: currChartData[0].name, data: _series }]);
    }
  }, [chartCreated, chartData, dataPrev, currChartData]);

  return (
    <Chart
      options={state.options}
      series={currChartData}
      type="bar"
      height="100%"
    />
  );
};

export default BarChart;
