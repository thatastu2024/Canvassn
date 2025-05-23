import { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2, VolumeX ,Send, X} from "lucide-react";
import axios from 'axios';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";


export default function BotCard({agentDataProps,isVoiceMode,onModeChange}) {
    const [hasPermission, setHasPermission] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [aiText,setAiText] = useState("");
    const [userText,setUserText] = useState("");
    const [historyId,setHistoryId] = useState()
    const [timer, setTimer] = useState("00:00");
    const [message, setMessage] = useState("");
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
                Authorization: `Bearer ${token}`,
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
          const url = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations/'+historyId;
          const options = {method: 'GET', headers: {'xi-api-key': process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE}};
          const response = await fetch(url, options);
          const conversationalData = await response.json();
          if(conversationalData !== undefined){
            let payload=conversationalData
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
        <>
      <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col items-center justify-center space-y-6 pt-20">
          <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={agentDataProps.avatar} alt={agentDataProps.name} />
                <AvatarFallback>{agentDataProps.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-4xl mt-4 font-semibold">{timer}</div>
              <div className="rounded-full bg-gray-200 p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => onModeChange(false)}
                >
                  <Phone className={`h-5 w-5 ${isVoiceMode ? "text-red-500" : ""}`} />
                </Button>
              </div>
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
            <button className="w-[100px] flex items-center justify-center gap-2  py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
            onClick={handleEndConversation}>
              <span><MicOff className="mr-2 h-4 w-4" /></span> End Conversation
            </button>
            ) : (
              <button className="w-[500px] flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
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
        </div>
        {status === "connected" && (
          <p className="text-green-600">
            {isSpeaking ? "Bot:"+(aiText) : "User:"+(userText)}
          </p>
        )}
    </div> 
    </ScrollArea>
    </> 
      );
}