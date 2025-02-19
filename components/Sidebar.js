import Link from 'next/link';
import { useState } from 'react';
import { FaRobot, FaHistory, FaBook, FaPhone, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
            { name: "Dashboard", icon: <FaRobot />, path: "/dashboard" },
            { name: "Agents", icon: <FaRobot />, path: "/agents" },
            { name: "Call History", icon: <FaHistory />, path: "/history" },
            { name: "Knowledge Base", icon: <FaBook />, path: "/knowledge" },
            { name: "Phone Numbers", icon: <FaPhone />, path: "/phone" },
            { name: "Settings", icon: <FaCog />, path: "/settings" },
          ].map((item)=>(
            <li className="py-2 px-4 hover:bg-gray-700">
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
