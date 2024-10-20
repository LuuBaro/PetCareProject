import React from "react";

import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  return (
    <div className="chart-container">
      <Bar data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
};
export default BarChart;