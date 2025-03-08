import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faCommentDots, faClock, faRefresh, faEye } from "@fortawesome/free-solid-svg-icons";
import {formatHumanReadableDate,formatTime} from '../utils/dateUtil'
import ConversationDetail from './ConversationDetail'
export default function ConversationsListComponent() {
  const [conversations,setConversations] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [conversationIdModel,setConversationIdModel] = useState()
  useEffect(()=>{
      const fetchData = async () => {
          try {
          let token=localStorage.getItem('token')
          await axios.get('/api/webhook',{
            headers:{
                Authorization:'Bearer '+token,
                "Content-Type": "application/json",
            }
          })
          const response = await axios.get('/api/bot',{
              headers:{
                  Authorization:'Bearer '+token,
                  "Content-Type": "application/json",
              }
          })
            if (!response.data.data.length) {
              throw new Error("Failed to fetch data");
            }
            setConversations(response?.data?.data);
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

  const HandleSync = async () =>{
    try {
      let token=localStorage.getItem('token')
      await axios.get('/api/webhook',{
        headers:{
            Authorization:'Bearer '+token,
            "Content-Type": "application/json",
        }
      })
      const response = await axios.get('/api/bot',{
          headers:{
              Authorization:'Bearer '+token,
              "Content-Type": "application/json",
          }
      })
        if (!response.data.data.length) {
          throw new Error("Failed to fetch data");
        }
        setConversations(response?.data?.data);
    } catch (error) {
      console.log(error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
    </div>
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mr-2" onClick={HandleSync}>Refresh</button>
        <select className="border rounded px-6 py-2 text-gray-600 mr-2">
          <option>Success</option>
          <option>Failed</option>
        </select>
        <select className="border rounded px-3 py-2 text-gray-600">
          <option>All agents</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Call happend At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Agent
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Messages
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Call Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Re-process
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {conversations.map((conversation, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><FontAwesomeIcon icon={faComments} /> {formatHumanReadableDate(conversation.start_time_unix_secs)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{conversation.agent_name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><FontAwesomeIcon icon={faCommentDots} /> {conversation.transcript ? conversation.transcript.length : 0}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><FontAwesomeIcon icon={faClock} /> {formatTime(conversation.call_duration_secs)}</td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${
              conversation.status === "processing" ? "text-yellow-500" : "text-green-500"
            }`}>{conversation.status}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {
                conversation.status === "processing" ?
                <FontAwesomeIcon icon={faRefresh} />
                :'success'
              }</td>
            <td 
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            onClick={() => setIsDetailModalOpen(true)}
            ><FontAwesomeIcon icon={faEye} onClick={e=>{setConversationIdModel(conversation._id)}} /></td>
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
    <ConversationDetail isOpen={isDetailModalOpen} conversationDetailsId={conversationIdModel} onClose={() => setIsDetailModalOpen(false)}/>
    </>
  );
}
