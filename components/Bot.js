import { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import axios from 'axios';
import Image from 'next/image';
import { faComment, faSignOut} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUnixTime } from '../utils/dateUtil';
export default function InitiateBotButton({agentDataProps}) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-10 right-11">
      <button
        onClick={togglePopup}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={faComment} />
      </button>
      {isOpen && <InitiatetBotForm closePopup={togglePopup} agentDataProps={agentDataProps} />}
    </div>
  );
}

function InitiatetBotForm({ closePopup,agentDataProps  }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiText,setAiText] = useState("");
  const [userText,setUserText] = useState("");
  const [isProspectAuthenticated,setIsProspectAuthenticated] = useState(false)
  const [isOpen,setIsOpen] = useState(false)
  const [prospectData, setProspectData] = useState({ name: "", email: "" });
  const conversation =useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      if(message.source === "ai"){
        console.log("ai",message.message)
        setAiText(message.message)
      }
      if(message.source === "user"){
        console.log("user",message.message)
        setUserText(message.message)
      }
    },
    onError: (error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      console.error("Error:", error);
    },
  });
  const { status, isSpeaking } = conversation;

  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        let prospectToken=localStorage.getItem(`prospect_token${agentDataProps.agent_id}`)
        if(prospectToken){
          setIsProspectAuthenticated(true)
        }
      } catch (error) {
        setErrorMessage("Microphone access denied");
        console.error("Error accessing microphone:", error);
      }
    };

    requestMicPermission();
  }, []);


  const handleChange = (e) => {
    setProspectData({ ...prospectData, [e.target.name]: e.target.value });
  };

  const handleStartConversation = async () => {
    try {
      const conversationId = await conversation.startSession({
        agentId: agentDataProps.agent_id,
      });
      let start_time_unix_secs=getUnixTime()
      let prospectToken=localStorage.getItem(`prospect_token${agentDataProps.agent_id}`);
      const prospectData = await axios.get('/api/prospects/details',{
        params:{
          token:prospectToken
        },
        headers:{
            Authorization:`Bearer ${prospectToken}`,
            "Content-Type": "application/json",
        }
      })
      const response = await axios.post('/api/bot', 
        {
          data:{
            agent_id: agentDataProps.agent_id,
            agent_name: agentDataProps.agent_name,
            conversation_id: conversationId,
            start_time_unix_secs: start_time_unix_secs,
            status: 'processing',
            prospect_id: prospectData?.data?.data?._id
          } 
        },
        {
          headers: {
            Authorization: `Bearer ${prospectToken}`,
            "Content-Type": "application/json",
          }
        }
      );
    } catch (error) {
      setErrorMessage("Failed to start conversation");
      console.error("Error starting conversation:", error);
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      setErrorMessage("Failed to end conversation");
      console.error("Error ending conversation:", error);
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (error) {
      setErrorMessage("Failed to change volume");
      console.error("Error changing volume:", error);
    }
  };

  const handleSubmit = async() => {
    if (prospectData.name && prospectData.email) {
      let token=localStorage.getItem('token')
      const response = await axios.post('/api/prospects',{
        agent_id:agentDataProps.agent_id,
        prospect_name: prospectData.name,
        prospect_email: prospectData.email,
        prospect_location: "mumbai"
      },{
        headers:{
          Authorization:'Bearer '+token,
          "Content-Type": "application/json",
      }
      })
      const prospectToken = response?.data?.data?.prospectToken;
      localStorage.setItem(`prospect_token${agentDataProps.agent_id}`, prospectToken);
      setIsProspectAuthenticated(true);
    } else {
      alert("Please enter your name and email.");
    }
  };

  const handleProspectLogout = async() =>{
    localStorage.removeItem(`prospect_token${agentDataProps.agent_id}`);
    setIsProspectAuthenticated(false);
  }
  return (
    <>
      <div className="absolute bottom-full right-0 mb-2 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
        <div className="p-4 space-y-4">
          <div className="flex flex-col items-center justify-center  bg-gradient-to-b from-white-100 to-blue-100 p-2">
            <div className="bg-white rounded-2xl p-6 w-96">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold"> 
                 { 
                  !isProspectAuthenticated ? (
                  "Enter Your Details"
                  ):(
                   "Voice Chat" 
                  )
                 }  
                </h2>
                <FontAwesomeIcon icon={faSignOut} onClick={handleProspectLogout} />
                <button onClick={closePopup} className="text-xl">&times;</button>
              </div>
              {
                isProspectAuthenticated ? (
                  <>
                  <div className="flex flex-col items-center justify-center  bg-gradient-to-b from-white-100 to-blue-100 p-2">
                    <h4>Powered by Canvassn</h4>
                    <h2 className="text-lg font-semibold text-gray-900">{agentDataProps.agent_name}</h2>
                  </div>
                  <div className="flex justify-center items-center mb-4">
                      <Image 
                          src={agentDataProps.avatar} 
                          alt="Avatar" 
                          width={100} 
                          height={100} 
                          className="rounded-full mb-6 mt-4"
                      />
                  </div>
                  <div className="flex justify-center items-center mb-4">
                      <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      onClick={toggleMute}
                      disabled={status !== "connected"}
                      >
                        {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                      </button>
                  </div>
                  {
                    status === "connected" ? (
                    <button className="w-full flex items-center justify-center gap-2  py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
                    onClick={handleEndConversation}>
                      <span><MicOff className="mr-2 h-4 w-4" /></span> End Conversation
                    </button>
                    ) : (
                      <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                      onClick={handleStartConversation}
                      disabled={!hasPermission}
                      >
                      <span><Mic className="mr-2 h-4 w-4" /></span> Start Conversation
                    </button>)
                  }
                  <div className="text-center text-sm">
                      {status === "connected" && (
                        <p className="text-green-600">
                          {isSpeaking ? "Agent is speaking..." : "Listening..."}
                        </p>
                      )}
                      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                      {!hasPermission && (
                        <p className="text-yellow-600">
                          Please allow microphone access to use voice chat
                        </p>
                      )}
                      {status === "connected" && (
                        <p className="text-green-600">
                          {isSpeaking ? "Bot:"+(aiText) : "User:"+(userText)}
                        </p>
                      )}
                  </div>
                  </>
                ):(
                  <>
                  <div className="flex flex-col items-center">
                    <div className="w-full mb-3">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="w-full mb-4">
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      onClick={handleSubmit}
                    >
                      ✅ Submit
                    </button>
                  </div>
                </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
