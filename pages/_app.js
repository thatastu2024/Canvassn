import '../styles/globals.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Login from './login'
import UserLogin from './users/login'
import axios from 'axios';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCustomer, setIsCustomer] = useState(false) 
  useEffect(() => {
    let token=localStorage.getItem('token')
    if(!token && router.pathname !== "/users/login"){
      setIsAuthenticated(false)
      console.log(router.pathname)
      router.push("/login");
    }else{
        if(router.pathname === "/users/login"){
          setIsCustomer(true)
          console.log(router.pathname)
        }else{
          setIsAuthenticated(!!token);
          console.log(router.pathname)
        }
    }
  }, [router.pathname]);

  return (
    <>
      {/* <canvassn-chat-widget agent-id="06BV0iCFoKRUp63IpyDs"></canvassn-chat-widget> <script src="https://ai-voice-bot-mauve.vercel.app/canvassn-chat-widget.js" async></script> */}
      {
        isAuthenticated ? (
          <Layout>
            <Component {...pageProps} isAuthenticated={isAuthenticated} />
          </Layout>
        ) : isCustomer ? (
          <UserLogin />
        ) : (
          <Login />
        )
      }
    </>
  );
}

export default MyApp;
