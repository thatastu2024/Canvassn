import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-gray-800 text-white h-full ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300`}>
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-xl font-bold ${isOpen ? 'block' : 'hidden'}`}>Unibox</h1>
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
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link className="flex items-center space-x-2" href="/inbox">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5M5 11L9 7M5 11l4 4"></path>
                </svg>
                <span className={`${isOpen ? 'block' : 'hidden'}`}>Inbox</span>
            </Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link className="flex items-center space-x-2" href="/sent">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16m16-8H8m8-4l4 4-4 4"></path>
                </svg>
                <span className={`${isOpen ? 'block' : 'hidden'}`}>Sent</span>
            </Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link className="flex items-center space-x-2" href="/drafts">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9m-9-4h7m-7-4h4m-4-4h2M4 4l16 16"></path>
                </svg>
                <span className={`${isOpen ? 'block' : 'hidden'}`}>Drafts</span>
            </Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link className="flex items-center space-x-2" href="/trash">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5v2m6-2v2m2 4v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6h10zM5 5h14M5 5l1-1h12l1 1"></path>
                </svg>
                <span className={`${isOpen ? 'block' : 'hidden'}`}>Trash</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
