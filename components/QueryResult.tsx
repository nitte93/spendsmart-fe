import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface QueryResultProps {
  response: {
    message: any;
    chart_type?: string;
    query_type?: string;
  };
}

const QueryResult: React.FC<QueryResultProps> = ({ response }) => {
  console.log({ response });
  const { message, chart_type, query_type } = response;

  if (chart_type && typeof message === 'object') {
    const chartData = {
      labels: message.map((item: any) => item.month),
      datasets: [
        {
          label: query_type || 'Data',
          data: message.map((item: any) => item.total_withdrawals),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: query_type || 'Chart',
        },
      },
    };

    if (chart_type === 'bar') {
      return <Bar data={chartData} options={chartOptions} />;
    } else if (chart_type === 'line') {
      return <Line data={chartData} options={chartOptions} />;
    }
  }

  if (Array.isArray(message)) {
    return (
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {Object.keys(message[0]).map((key) => (
              <th key={key} className="py-2 px-4 border-b">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {message.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value: any, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 border-b">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // If message is a string, simply display it
  return <p>{message}</p>;
};

export default QueryResult;