import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ datas }) => {
  const labelProduct = Object.keys(datas).slice(0, 5);
  const dataProduct = Object.values(datas).slice(0, 5);

  const data = {
    labels: labelProduct,
    datasets: [
      {
        label: "Most Liked Product",
        data: dataProduct,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    // Makes the chart take up more available space within its container
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div className="pie-chart" style={{ height: "300px", width: "100%" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
