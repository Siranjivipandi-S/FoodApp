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
  const parsedData = datas.map((dataItem) => parseInt(dataItem));

  const data = {
    labels: label,
    datasets: [
      {
        data: parsedData,
        fill: false,
        borderColor: "rgb(0, 0, 139)",
        tension: 0.1,
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
    },
  };

  return (
    <div className="line-chart">
      <h1 className="text-start text-2xl font-bold">Daily Transaction</h1>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
