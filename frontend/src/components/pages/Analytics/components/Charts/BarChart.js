// import React from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { usePrevious } from "react-use";
import { useState } from "react/cjs/react.development";

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
        mouseMove: chartEvent,
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
      borderColor: "#212121",
      clipMarkers: false,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#999",
          label: {
            show: true,
            // text: "Support",
            style: {
              color: "#fff",
              background: "#00E396",
            },
          },
        },
      ],
      xaxis: [
        {
          x: new Date().getTime(),
          borderColor: "#999",
          yAxisIndex: 0,
          label: {
            show: true,
            // text: "Volume",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
      ],
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
      // min: new Date("10 Aug 2021").getTime(),
      tickAmount: 20,
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
      name: "Volume(USD)",
      data: [],
    },
  ],
};
const BarChart = ({ chartData }) => {
  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false);
  const dataPrev = usePrevious(chartData);
  const [currChartData, setChartData] = useState(state.series);

  useEffect(() => {
    if (chartData !== dataPrev && chartData) {
      console.log(chartData);
      const _series =
        chartData.length > 0
          ? chartData.map((item) => [
              item.date * 1000,
              item.dailyVolumeUSD ? parseInt(item.dailyVolumeUSD) : 0,
            ])
          : [];
      setChartData([{ name: currChartData[0].name, data: _series }]);
    }
  }, [chartCreated, chartData, dataPrev]);

  return (
    <Chart
      options={state.options}
      series={currChartData}
      type="bar"
      width={"98%"}
    />
  );
};

export default BarChart;
