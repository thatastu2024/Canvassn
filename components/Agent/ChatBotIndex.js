import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from "@/components/ui/sidebar";
import AgentList from "./AgentList";
import ChatInterface from "./Chatinterface";
import axios from 'axios';
// import BotCard from './BotCard';
// import BotButton from './Bot';
// import ViewAgentComponent from './Prospect/ViewAgent';
// import ChatBot from './Chatbot/index'

// Mock data for demonstration

export default function ChatBotIndex () {
    const [agents,setAgents] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAgent,setSelectedAgent] = useState({
      _id:0,
      agent_id:0,
      agent_name:"",
      avatar:"",
      agent_type:"",
      status:"online"
    })
    const [isSelected,setIsSelected] = useState(false)

    useEffect(()=>{
        const fetchData = async () => {
            try {
            let token=localStorage.getItem('token')
            const response = await axios.get('/api/chatagent',{
                headers:{
                    Authorization:'Bearer '+token,
                    "Content-Type": "application/json",
                }
            })
            console.log(response.data)
              if (!response.data.data.length) {
                throw new Error("Failed to fetch data");
              }
              setAgents(response?.data?.data);
            } catch (error) {
              console.log(error)
              setError(error.message);
            } finally {
              setLoading(false);
            }
        };
        fetchData()
    },[])

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          Loading agents...
        </div>
      );
    }
  
    if(!agents?.length === 0 || agents === undefined){
      return <p className="text-gray-500 p-4">No data found.</p>;
    }

  return (
    <div className="flex min-h-screen w-full">
    <div className="w-64 border-r">
      <div className="border-b px-4 py-6">
        <h1 className="text-xl font-bold">AI Agents</h1>
      </div>
      <div className="h-[calc(100vh-88px)] overflow-auto">
        <AgentList
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
        />
      </div>
    </div>
    
    <main className="flex-1">
      <ChatInterface selectedAgent={selectedAgent} />
    </main>
  </div>
  );
};
