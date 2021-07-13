// import React from "react";
import Chart from "react-apexcharts";

const state = {
  options: {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#E0077D"],
    xaxis: {
      type: "number",
      min: 1,
      tickAmount: 4,
      categories: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
    },
    tooltip: {
      theme: "dark",
    },
  },
  series: [
    {
      name: "Volume",
      data: [
        30, 40, 45, 50, 49, 60, 70, 91, 30, 40, 45, 50, 49, 60, 70, 91, 30, 40,
        45, 50, 49, 60, 70, 91,
      ],
    },
  ],
};

const BarChart = () => (
  <Chart
    options={state.options}
    series={state.series}
    type="bar"
    width="120%"
  />
);

export default BarChart;
