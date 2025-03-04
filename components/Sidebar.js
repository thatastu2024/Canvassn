import Link from 'next/link';
import { useState } from 'react';
import { FaRobot, FaHistory, FaBook, FaPhone, FaCog } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem('token')
    router.push("/login");
  }

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
          {[
            { id:1, name: "Dashboard", icon: <FaRobot />, path: "/dashboard" },
            { id:2, name: "Agents", icon: <FaRobot />, path: "/agents" },
            { id:3, name: "Call History", icon: <FaHistory />, path: "/conversations" },
            { id:4, name: "Leads", icon: <FaHistory />, path: "/prospects" },
            { id:5, name: "Knowledge Base", icon: <FaBook />, path: "/knowledge-base" },
            { id:6, name: "Settings", icon: <FaCog />, path: "/settings" },
          ].map((item)=>(
            <li key={item.id} className="py-2 px-4 hover:bg-gray-700">
            <Link className="flex items-center space-x-2" key={item.name} href={item.path}>
            {item.icon} <span className={`${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
            </Link>
          </li>
          ))}
        </ul>
      </nav>
      <nav className="mt-20">
      <button className="flex items-center space-x-5 bg-red-600 px-20 py-2 rounded-md hover:bg-red-700"
        onClick={logout}>
          <span className="text-sm">Logout</span>
        </button>
      </nav>
    </div>
  );
}
