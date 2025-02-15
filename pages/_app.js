import '../styles/globals.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false) 
  useEffect(() => {
    if (router.pathname === "/") {
      let token=localStorage.getItem('token')
      setIsAuthenticated(!!token);
      if(!token && router.pathname !== 'login'){
        setIsAuthenticated(false)
        router.push("/login");
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} isAuthenticated={isAuthenticated} />;
}

export default MyApp;
