// import React from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { useState } from "react/cjs/react.development";
import { usePrevious } from 'react-use'

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
      // min: new Date("01 Mar 2012").getTime(),
      // tickAmount: 4,
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
      name: "TVL USD",
      data: [
      ],
    },
  ],
};

const AreaChart = ({ chartData }) => {

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const dataPrev = usePrevious(chartData)
  const [currChartData, setChartData] = useState(state.series)

  useEffect(() => {

    if (chartData !== dataPrev && chartData) {
      const _data = chartData.length > 0 ? chartData.map(item => [item.date * 1000, item.totalLiquidityUSD ? parseInt(item.totalLiquidityUSD) : 0]) : []
      setChartData([{ name: currChartData[0].name, data: _data }])
    }

  }, [chartCreated, chartData, dataPrev])


  return (
    < Chart
      options={state.options}
      series={currChartData}
      type="area"
      width="100%"
    />
  )
}

export default AreaChart;
