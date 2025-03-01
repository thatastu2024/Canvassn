"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "Jan 30", value: 0 },
  { date: "Feb 01", value: 0 },
  { date: "Feb 03", value: 0 },
  { date: "Feb 05", value: 0 },
  { date: "Feb 07", value: 24 },
  { date: "Feb 09", value: 1 },
  { date: "Feb 11", value: 0 },
  { date: "Feb 13", value: 0 },
  { date: "Feb 15", value: 0 },
  { date: "Feb 17", value: 0 },
  { date: "Feb 19", value: 0 },
  { date: "Feb 21", value: 0 },
  { date: "Feb 23", value: 0 },
  { date: "Feb 25", value: 0 },
  { date: "Feb 27", value: 0 },
  { date: "Mar 01", value: 14 },
];

const DashboardLineChart = () => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Performance Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={2} dot={{ fill: "white", stroke: "black", strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardLineChart;
