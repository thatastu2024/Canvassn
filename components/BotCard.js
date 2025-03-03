import { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import axios from 'axios';
import Image from 'next/image';


export default function BotCard({agentDataProps}) {
    const [hasPermission, setHasPermission] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [aiText,setAiText] = useState("");
    const [userText,setUserText] = useState("");
    const [historyId,setHistoryId] = useState()
    
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
          } catch (error) {
            setErrorMessage("Microphone access denied");
            console.error("Error accessing microphone:", error);
          }
        };
    
        requestMicPermission();
      }, []);
    
      const handleStartConversation = async () => {
        try {    
          const conversationId = await conversation.startSession({
            agentId: agentDataProps.agent_id 
          });
          setHistoryId(conversationId)
          console.log("Started conversation:", conversationId);
          let token=localStorage.getItem('token')
          const response = await axios.post('/api/bot',{
            data:{
              agent_id:agentDataProps.agent_id,
              agent_name:agentDataProps.agent_name,
              conversation_id:conversationId
            },
            headers:{
                Authorization:'Bearer '+token,
                "Content-Type": "application/json",
            }
          })
        } catch (error) {
          setErrorMessage("Failed to start conversation");
          console.error("Error starting conversation:", error);
        }
      };
    
      const handleEndConversation = async () => {
        try {
          await conversation.endSession();
          const conversationalData = await axios.get(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations/'+historyId,{
            headers:{
            'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
            "Content-Type": "application/json",
            }
          })
          if(conversationalData !== undefined){
            let payload=conversationalData?.data
            let token=localStorage.getItem('token')
            const response = await axios.patch('/api/bot/'+historyId,{
              payload,
              headers:{
                  Authorization:'Bearer '+token,
                  "Content-Type": "application/json",
              }
            })
          }
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
      return (
      <div className="flex flex-col items-center justify-center  bg-gradient-to-b from-white-100 to-blue-100 p-2">
        <h4>Powered by Canvassn</h4>
        <h2 className="text-lg font-semibold text-gray-900">Voice Chat</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
          <div className="flex flex-col items-center">
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
        </div>

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
        </div>
        {status === "connected" && (
          <p className="text-green-600">
            {isSpeaking ? "Bot:"+(aiText) : "User:"+(userText)}
          </p>
        )}
    </div>  
      );
}