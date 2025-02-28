import { useState, useEffect } from 'react';
import axios from 'axios';
export default function ConversationsListComponent() {
  const [conversations,setConversations] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
      const fetchData = async () => {
          try {
          let token=localStorage.getItem('token')
          const response = await axios.get('/api/conversations',{
              params:{
                agent_id:'06BV0iCFoKRUp63IpyDs',
                page_size:'100'
              },
              headers:{
                  Authorization:'Bearer '+token,
                  "Content-Type": "application/json",
              }
          })
          console.log(response.data.data.conversations)
            if (!response.data.data.length) {
              throw new Error("Failed to fetch data");
            }
            console.log(response?.data?.data?.conversations)
            setConversations(response?.data?.data?.conversations);
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
        Loading conversations...
      </div>
    );
  }
  if(!conversations?.length === 0 || conversations === undefined){
    return <p className="text-gray-500 p-4">No data found.</p>;
  }

  return (
    <div className="w-1/3 p-0 border-r">
    <h2 className="text-lg font-bold mb-4">AI Agents</h2>
    <hr/>
    {conversations?.map((data, index) => (
      <div
        key={index}
        className="p-3 bg-white-200 rounded-lg cursor-pointer hover:bg-gray-200 mb-2"
        onClick={() => onSelect(data)}
      >
        {data.agent_name}
      </div>
    ))}
  </div>
  );
}
