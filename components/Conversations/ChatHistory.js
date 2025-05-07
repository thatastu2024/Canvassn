import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import {newFormatDateTime} from '../../utils/dateUtil'
import ChatDetail from './ChatDetails'
import { Card } from "@/components/ui/card";
import { Timer,Brain,MessageCircle,UserRound,Eye,MessageCircleMore } from 'lucide-react';
export default function ChatHistoryComponent(data) {
  const [chatHistory,setChatHistory] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [conversationIdModel,setConversationIdModel] = useState()
  const [agentData, setAgentData] = useState([])
  useEffect(()=>{
      fetchData("All")
      fetchAgents()
  },[])
    const fetchData = async (agentId) => {
      try {
      let token=localStorage.getItem('token')
      const response = await axios.get('/api/bot?type=chat&agentId='+agentId,{
          headers:{
              Authorization:'Bearer '+token,
              "Content-Type": "application/json",
          }
      })
        if (!response.data.data.length) {
          throw new Error("Failed to fetch data");
        }
        setChatHistory(response?.data?.data);
      } catch (error) {
        console.log(error)
        setError(error.message);
      } finally {
        setLoading(false);
      }
  };
  const fetchAgents = async() =>{
        try{
          let token=localStorage.getItem('token')
          const agentData = await axios.get('/api/chatagent/util',{
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type": "application/json",
            }
          })
          setAgentData(agentData?.data?.data)
        }catch(error){
          console.log(error)
        }
      }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading conversations...
      </div>
    );
  }
  
  if(!chatHistory?.length === 0 || chatHistory === undefined){
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-500">
            No Call History Found
          </h2>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <select name="agent" className="border rounded px-3 py-2 text-gray-600" onChange={(e)=>fetchData(e.target.value)}>
          <option value="">Select agent</option>
          <option value="">All</option>
          {agentData.map((agent) => (
            <option key={agent.agent_id || agent._id} value={agent.agent_id || agent._id}>{agent.name} - {agent.agent_type}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <Timer />
              Chat happend At
            </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <Brain/>
                Agent
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <MessageCircle/>
              Messages
             </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <UserRound></UserRound>
              Prospect
            </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        { chatHistory.map((chat, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{newFormatDateTime(chat.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chat.agent.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MessageCircleMore /> {chat.total_message_exchange}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chat.prospect.name}</td>
            <td 
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            onClick={() => setIsDetailModalOpen(true)}
            ><Eye onClick={e=>{setConversationIdModel(chat._id)}} /></td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        {/* <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button> */}
      </div>
    </div>
    <ChatDetail isOpen={isDetailModalOpen} conversationDetailsId={conversationIdModel} onClose={() => setIsDetailModalOpen(false)}/>
    </>
  );
}
