import '../styles/globals.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Login from './login'


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false) 
  useEffect(() => {
    let token=localStorage.getItem('token')
    if(!token){
      setIsAuthenticated(false)
      router.push("/login");
    }else{
      setIsAuthenticated(!!token);
    }
  }, [router.pathname]);

  return (
    <>
      {
        isAuthenticated ? 
          (
          <Layout><Component {...pageProps} isAuthenticated={isAuthenticated} /></Layout>
        ) : (<Login></Login>)
      }
    </>
  );
}

export default MyApp;
