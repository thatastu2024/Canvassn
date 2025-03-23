import Link from 'next/link';
import { useState,useEffect } from 'react';
import { FaRobot, FaHistory, FaBook, FaPhone, FaUser , FaCog } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          router.push("/login");
          return;
        }

        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user type");

        const data = await response.json();
        setUserRole(data.user_type);

      } catch (error) {
        console.error("Error fetching user type:", error);
        router.push("/login");
      }
    };

    fetchUserType();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const routes=[
    { id:1, name: "Dashboard", icon: <FaRobot />, path: "/dashboard",allowed:["superadmin"]},
    { id:2, name: "Agents", icon: <FaRobot />, path: "/agents", allowed:["superadmin","admin","employee"] },
    { id:3, name: "Call History", icon: <FaHistory />, path: "/conversations", allowed:["superadmin","admin","employee"] },
    { id:4, name: "Leads", icon: <FaHistory />, path: "/prospects", allowed:["superadmin","admin","employee"] },
    { id:5, name: "Knowledge Base", icon: <FaBook />, path: "/knowledge-base", allowed:["superadmin"] },
    { id:6, name: "Users", icon: <FaUser />, path: "/users", allowed:["superadmin"] },
    { id:7, name: "Settings", icon: <FaCog />, path: "/settings",allowed:["superadmin"] },
  ]

  return (
    <div className={`bg-gray-800 text-white h-full ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300`}>
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-xl font-bold ${isOpen ? 'block' : 'hidden'}`}>Canvassn</h1>
        <button onClick={toggleSidebar} className="focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {routes.filter((route) => route.allowed.includes(userRole))
          .map((item)=>(
            <li key={item.id} className="py-2 px-4 hover:bg-gray-700">
            <Link className="flex items-center space-x-2" key={item.name} href={item.path}>
            {item.icon} <span className={`${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
            </Link>
          </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
