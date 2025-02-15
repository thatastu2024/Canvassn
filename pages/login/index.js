import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const router = useRouter();

  // useEffect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    let payload = {
      email:email,
      password:password
    }

    try{
      const response = await axios.post('/api/auth/login',payload, { withCredentials: true })
      if(response.hasOwnProperty('data')){
        localStorage.setItem('token',response.data.token)
      }
      alert("Login successful!");
      router.push("/");
    }catch(error){
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div> */}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleOAuthSignIn('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 12.3c0-.9-.1-1.8-.2-2.7H12v5.2h6.6c-.3 1.4-1.2 2.5-2.3 3.3v2.7h3.7c2.2-2 3.5-4.9 3.5-8.5z"></path>
                <path d="M12 24c3.2 0 5.8-1 7.7-2.7l-3.7-2.7c-1 .7-2.3 1.1-3.9 1.1-3 0-5.6-2-6.5-4.7H1.8v2.9C3.8 21.7 7.6 24 12 24z"></path>
                <path d="M5.5 14.3c-.5-1.4-.5-2.8 0-4.2V7.2H1.8C.3 9.6 0 12.3 0 15c0 2.7.3 5.4 1.8 7.8l3.7-2.9z"></path>
                <path d="M12 4.8c1.6 0 3 .6 4.1 1.7l3-3C16.9 1.2 14.4 0 12 0 7.6 0 3.8 2.3 1.8 5.8l3.7 2.9C6.4 6.8 8.9 4.8 12 4.8z"></path>
              </svg>
            </button>
            <button
              onClick={() => handleOAuthSignIn('azure-ad')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Azure AD</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1.8 15.6l-1.8-3.6-1.8 3.6h3.6zM8.4 9l3.6 6.8 3.6-6.8H8.4z"></path>
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
