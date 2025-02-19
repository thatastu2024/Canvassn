import { useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Dashboard = () => {
  useEffect(() => {
    axios.get("/api/auth/me", { withCredentials: true })
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <></>
    // <Layout></Layout>
  )
};

export default Dashboard;
