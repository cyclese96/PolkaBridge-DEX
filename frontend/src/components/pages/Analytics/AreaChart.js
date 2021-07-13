// import React from "react";
import Chart from "react-apexcharts";

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
      id: "area-datetime",
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
    legend: {
      show: false,
    },
    colors: ["#E0077D"],
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
            // text: "Rally",
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
      min: new Date("01 Mar 2012").getTime(),
      tickAmount: 4,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {},
      theme: "dark",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  },
  selection: "all",
  series: [
    {
      name: "TVL",
      data: [
        [1330642800000, 33.73],
        [1330902000000, 33.22],
        [1330988400000, 31.99],
        [1331074800000, 32.41],
        [1331161200000, 33.05],
        [1331247600000, 33.64],
        [1331506800000, 33.56],
        [1331593200000, 34.22],
        [1331679600000, 33.77],
        [1331766000000, 34.17],
        [1331852400000, 33.82],
        [1332111600000, 34.51],
        [1332198000000, 33.16],
        [1332284400000, 33.56],
        [1332370800000, 33.71],
        [1332457200000, 33.81],
        [1332712800000, 34.4],
        [1332799200000, 34.63],
        [1332885600000, 34.46],
        [1332972000000, 34.48],
        [1333058400000, 34.31],
        [1333317600000, 34.7],
        [1333404000000, 34.31],
        [1333490400000, 33.46],
        [1333576800000, 33.59],
        [1333922400000, 33.22],
        [1334008800000, 32.61],
        [1334095200000, 33.01],
        [1334181600000, 33.55],
        [1334268000000, 33.18],
      ],
    },
  ],
};

const AreaChart = () => (
  <Chart
    options={state.options}
    series={state.series}
    type="area"
    // width="350"
    width="120%"
  />
);

export default AreaChart;
