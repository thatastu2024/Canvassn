import { useState, useEffect } from 'react';
import axios from 'axios';
import BotCard from './BotCard';
import BotButton from './Bot';
export default function AgentListComponent() {
  const [agents,setAgents] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent,setSelectedAgent] = useState({
    _id:0,
    agent_id:0,
    agent_name:"",
    avatar:""
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

  const onSelect = (agent) =>{
    setSelectedAgent(()=>({
      _id:agent._id,
      agent_id:agent.agent_id,
      agent_name:agent.name,
      avatar:agent.avatar
    }))
    setIsSelected(true)
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 p-4 border">
        <div className="p-4 border-r">
          <h2 className="text-lg font-bold mb-4">AI Agents</h2>
          <hr />
          {agents.map((agent, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-200 mb-2"
              onClick={() => onSelect(agent)}
            >
              {agent.name}
            </div>
          ))}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">{selectedAgent.agent_name}</h2>
          <hr />
          {
            isSelected ? (
              <BotCard agentDataProps={selectedAgent}></BotCard>
            ) : (
              <h2 className="text-gray-500 text-2xl font-semibold">No Agent Selected</h2>
            )
          }
          {
            isSelected ? (
              <p className='flex-1 bg-transparent text-sm outline-none'>{`<canvassn-chat-widget agent-id="${selectedAgent.agent_id}"></canvassn-chat-widget>
          <script src="https://ai-voice-bot-mauve.vercel.app/canvassn-chat-widget.js" async></script>`}</p>
            ) : ("")
          }
        </div>
      </div>
      {
            isSelected ? (
              <BotButton agentDataProps={selectedAgent} />
            ) : (
              ""
            )
      }
    </div>
  );
}
