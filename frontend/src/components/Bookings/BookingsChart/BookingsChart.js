import React from "react";
import { Bar as BarChart } from "react-chartjs";

const BUCKETS = {
  cheap: {
    min: 0,
    max: 10
  },
  normal: {
    min: 11,
    max: 30
  },
  expensive: {
    min: 31,
    max: 100
  }
};

const BookingsChart = props => {
  const chartData = { labels: [], datasets: [] };
  const values = [];

  for (const bucket in BUCKETS) {
    const count = props.bookings.reduce((prev, curr) => {
      if (
        curr.event.price > BUCKETS[bucket].min &&
        curr.event.price < BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    chartData.labels.push(bucket);
    values.push(count);
  }

  chartData.datasets.push({
    fillColor: "rgba(220,220,220,0.5)",
    strokeColor: "rgba(220,220,220,0.8)",
    highlightFill: "rgba(220,220,220,0.75)",
    highlightStroke: "rgba(220,220,220,1)",
    data: values
  });

  return (
    <div style={{ textAlign: "center" }}>
      <BarChart data={chartData} />
    </div>
  );
};

export default BookingsChart;
