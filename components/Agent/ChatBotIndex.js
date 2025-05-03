import { useState, useEffect } from "react";
import AgentList from "./AgentList";
import ChatInterface from "./Chatinterface";
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
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
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Top Button */}
      <div className="p-4 border-b flex justify-end">
        <Button onClick={() => alert("Top Button Clicked")}>
          New agent
        </Button>
      </div>

      <div className="flex flex-1">
        {!agents?.length === 0 || agents === undefined ? (
          <div className="flex flex-1 items-center justify-center">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-500">
                No Agent Found
              </h2>
            </Card>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <div className="w-64 border-r">
              <div className="border-b px-4 py-6">
                <h1 className="text-xl font-bold">AI Agents</h1>
              </div>
              <div className="h-[calc(100vh-136px)] overflow-auto">
                <AgentList
                  agents={agents}
                  selectedAgent={selectedAgent}
                  onSelectAgent={setSelectedAgent}
                />
              </div>
            </div>

            {/* Chat Interface */}
            <main className="flex-1">
              <ChatInterface selectedAgent={selectedAgent} />
            </main>
          </>
        )}
      </div>
    </div>
  )
};
