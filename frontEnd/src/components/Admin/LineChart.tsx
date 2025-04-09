import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const LineChart = ({ label, datas }) => {
  // Slice the last 14 items from both labels and data
  const slicedLabels = label.slice(-14);
  const slicedDatas = datas.slice(-14);

  // Parse the sliced data
  const parsedData = slicedDatas.map((dataItem) => parseInt(dataItem));

  const data = {
    labels: slicedLabels,
    datasets: [
      {
        data: parsedData,
        fill: false,
        borderColor: "rgb(132, 204, 255)", // Lighter blue for better visibility on dark background
        borderWidth: 2,
        tension: 0.1,
        pointBackgroundColor: "rgb(255, 255, 255)", // White points
        pointHoverBackgroundColor: "rgb(255, 255, 255)",
        pointBorderColor: "rgb(132, 204, 255)",
        pointHoverBorderColor: "rgb(132, 204, 255)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.8)", // slate-900 with opacity
        titleColor: "rgb(255, 255, 255)",
        bodyColor: "rgb(226, 232, 240)", // slate-200
        borderColor: "rgb(132, 204, 255)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)", // slate-400 with low opacity
        },
        ticks: {
          color: "rgb(226, 232, 240)", // slate-200
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)", // slate-400 with low opacity
        },
        ticks: {
          color: "rgb(226, 232, 240)", // slate-200
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
