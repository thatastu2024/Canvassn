import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {jwtDecode} from "jwt-decode"; 
import LoginPage from "@/pages/users/login"

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token"); // Remove expired token
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem("token"); // Remove invalid token
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && !["/login", "/register"].includes(router.pathname)) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if(router.pathname === '/users/login'){
    return (
      <LoginPage/>
    )
  }
  return (
    <div className="flex h-screen">
        <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
    </div>
  );
}
