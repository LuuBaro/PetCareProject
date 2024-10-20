import React from "react";

import { Line } from 'react-chartjs-2';

const LineChart = ({ data }) => {
  return (
    <div className="chart-container">
      <Line data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
};
export default LineChart;