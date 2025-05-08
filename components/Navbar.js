import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from "next/router";
import {jwtDecode} from "jwt-decode";
export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logout = () =>{
    let token=localStorage.getItem("token");
    const decoded = jwtDecode(token);
    if(decoded.user_type === "admin"){
      localStorage.removeItem('token')
      router.push('/users/login');
    } else {
      localStorage.removeItem('token')
      router.push("/login");
    }
  }

  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-white text-lg font-semibold" href="/">
        </Link>
        <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <img
                    src='/Men.webp'
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    {/* <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-200" href="/profile">
                      View Profile
                    </Link> */}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </nav>
  );
}
