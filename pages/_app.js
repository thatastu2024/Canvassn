import '../styles/globals.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Login from './login'
import axios from 'axios';

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
      {/* <canvassn-chat-widget agent-id="06BV0iCFoKRUp63IpyDs"></canvassn-chat-widget> <script src="https://ai-voice-bot-mauve.vercel.app/canvassn-chat-widget.js" async></script> */}
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
