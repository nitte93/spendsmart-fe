import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface QueryResultProps {
  response: {
    message: string;
    visualization?: string;
    query_type?: string;
    formated_data_for_visualization?: { data: any[], name?: string, value1?: string | number, value2?: string | number};
  };
}
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const QueryResult: React.FC<QueryResultProps> = ({ response }) => {
  console.log({ response });
  const { message, visualization: chart_type, query_type, formated_data_for_visualization } = response;
  if (typeof message === "string" && !formated_data_for_visualization){
      // If message is a string, simply display it
    return <p>{message}</p>;

  }
  console.log({chart_type})
  const {data: chart_data, name, value1, value2} = formated_data_for_visualization
  if (chart_type !== 'none' && formated_data_for_visualization) {
    if (chart_type === 'bar') {
      const chartData = chart_data.map((item: any) => ({
        [name]: item.name,
        [value1]: item.value1,
        ...(item.value2 !== undefined && { [value2]: item.value2 }),
      }));
  
      return (
        <>
        <p>{message}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}           
          width={500}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={name} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={value1} fill="#82ca9d" />
            {value2 && <Bar dataKey={value2} fill="#8884d8" />}
          </BarChart>
        </ResponsiveContainer>
        </>
      );
    } else if (chart_type === 'line') {
      const chartData = chart_data.map((item: any) => ({
        [name]: item.name,
        [value1]: item.value1,
        ...(item.value2 !== undefined && { [value2]: item.value2 }),
      }));
  
      return (
        <>
        <p>{message}</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
          data={chartData} 
          width={500}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={name} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={value1} stroke="#8884d8" />
            {value2 && <Line type="monotone" dataKey={value2} stroke="#82ca9d" />}
          </LineChart>
        </ResponsiveContainer>
        </>
      );
    } else if (chart_type === 'horizontalBar') { // Handle horizontal bar chart
      const chartData = chart_data.map((item: any) => ({
        [name]: item.name,
        [value1]: item.value1,
        ...(item.value2 !== undefined && { [value2]: item.value2 }),
      }));
  
      return (
        <>
        <p>{message}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" // Set layout to vertical
          width={500}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis type="category" dataKey={name} />
            <XAxis type="number" />
            <Tooltip />
            <Bar dataKey={value1} fill="#82ca9d" />
            {value2 && <Bar dataKey={value2} fill="#8884d8" />}
          </BarChart>
        </ResponsiveContainer>
        </>
      );
    } else if (chart_type === 'pie') { // Handle pie chart
      console.log("sandas",chart_data, formated_data_for_visualization)
      const pieCharts = formated_data_for_visualization.data; // Access multiple pie charts
      console.log({pieCharts})
      return (
        <>
        <p>{message}</p>
          {Object.entries(pieCharts).map(([chartKey, chartData]) => (
            <div key={chartKey}>
              <h3>{chartData.label}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={chartData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#000" label={renderCustomizedLabel}>
                    {chartData.data.map((entry) => {
                      const randomColor = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][Math.floor(Math.random() * 4)];
                      return <Cell key={entry.name} fill={randomColor} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </>
      );
    } else if (chart_type === 'table'){
      const tableData = formated_data_for_visualization.data; // Access table data
      return (
        <div className="overflow-auto" style={{ maxHeight: '400px', maxWidth: '600px' }}> {/* Set fixed height and width */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((key) => (
                  <th key={key} className="py-2 px-4 border-b">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 border-b">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
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

};

export default QueryResult;