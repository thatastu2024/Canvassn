import { useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import LineChart from "../components/DashboardLineChart";

const Dashboard = () => {
  // useEffect(() => {
  //   axios.get("/api/auth/me", { withCredentials: true })
  //     .then((res) => console.log(res.data))
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* {[1, 2, 3, 4].map((num) => (
          <div key={num} className="p-6 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-bold">Counter {num}</h2>
            <p className="text-2xl font-semibold text-blue-500">{num * 10}</p>
          </div>
        ))} */}
        <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-sm text-subtle font-medium">Users</h2>
            <p className="text-2xl font-semibold text-black-500">10</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-sm text-subtle font-medium">Agents</h2>
            <p className="text-2xl font-semibold text-black-500">2</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-sm text-subtle font-medium">Total Calls</h2>
            <p className="text-2xl font-semibold text-black-500">30</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-sm text-subtle font-medium">Average Duration</h2>
            <p className="text-2xl font-semibold text-black-500">0:27</p>
        </div>
      </div>

      <div className="p-6 bg-white shadow-lg rounded-lg">
        <LineChart></LineChart>
      </div>
    </div>
  )
};

export default Dashboard;
