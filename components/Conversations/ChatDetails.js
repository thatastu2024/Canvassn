import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatDetail = ({ isOpen, onClose, conversationDetailsId }) => {
  console.log(conversationDetailsId)
    const [activeTab, setActiveTab] = useState("transcription");
    const [chatHistory,setChatHistory] = useState({})
    useEffect(()=>{
        if(isOpen){
            fetchConversationDetailById(conversationDetailsId)
        }
    },[isOpen])

    const fetchConversationDetailById = async (id) =>{
      try{
        let token=localStorage.getItem('token')
        const response=await axios.get('/api/bot/show/'+id+'?type=chat',{
            headers:{
                Authorization:'Bearer '+token,
                "Content-Type": "application/json",
            }
        })
        setChatHistory(response?.data?.chatHisotryDetails)
      }catch(error){
        console.log(error)
      }
    }
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[75%] bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Conversation with  {chatHistory?.agentData?.name}</h2>
        <button className="text-red-500 text-lg" onClick={onClose}>
          ✖
        </button>
      </div>
      <div className="p-4 grid grid-rows-[30%_70%] gap-4 h-[calc(100%-60px)]">
        <div className="bg-white p-4 border-b w-full h-full grid grid-cols-[20%_80%] items-center gap-4">
            <div className="flex justify-center">
                <img
                src="/Men.webp"
                alt="Profile"
                className="w-20 h-21 rounded-full object-cover"
                />
            </div>
            <div className="space-y-1">
            <div className="text-lg font-semibold">{chatHistory?.prospectData?.prospect_name}</div>
            <div className="text-gray-600"><FontAwesomeIcon icon={faEnvelope}/> {chatHistory?.prospectData?.prospect_email}</div>
            <div className="text-gray-600">📍 {chatHistory?.prospectData?.prospect_location}</div>
          </div>
        </div>
        <div className="bg-white w-full flex flex-col">
            <div className="flex border-b">
                {["transcription"].map(
                (tab) => (
                    <button
                    key={tab}
                    className={`p-3 flex-1 text-center capitalize ${
                        activeTab === tab
                        ? "border-b-2 border-blue-500 font-semibold"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab(tab)}
                    >
                    {tab.replace("_", " ")}
                    </button>
                )
                )}
            </div>
            <div className="p-4 flex-grow overflow-auto">
                {activeTab === "transcription" && (
                  <div className="p-4 h-[400px] overflow-y-auto bg-white-100 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Chat</h2>
                    <div className="flex flex-col space-y-3">
                      {chatHistory?.transcript?.map((msg, index) => (
                        <div key={index} className={`flex items-start w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          {msg.role === "user" && msg.message !== null && (
                            <div className="flex items-center space-x-2">
                              <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[75%]">
                                {msg.message}
                              </div>
                              <img src='/Men.webp' alt="User" className="w-8 h-8 rounded-full" />
                            </div>
                          )}
                          {msg.role === "bot" && msg.message !== null && (
                            <div className="flex items-center space-x-2">
                              <img src='/Men.webp' alt="AI" className="w-8 h-8 rounded-full" />
                              <div className="bg-gray-300 text-black p-3 rounded-lg max-w-[75%]">
                                {msg.message}
                              </div>
                            </div>
                          )}
                      </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
