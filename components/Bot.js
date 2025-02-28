import { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import axios from 'axios';

export default function InitiateBotButton() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={togglePopup}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        Start Call
      </button>
      {isOpen && <InitiatetBotForm closePopup={togglePopup} />}
    </div>
  );
}

function InitiatetBotForm({ closePopup }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiText,setAiText] = useState("");
  const [userText,setUserText] = useState("");

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
        agentId: 'Fin5OXTpA8dsxCzFicTO',
      });
      console.log("Started conversation:", conversationId);
      let token=localStorage.getItem('token')
      const response = await axios.post('/api/bot',{
        data:{
          agent_id:'Fin5OXTpA8dsxCzFicTO',
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Ai Voice Bot</h2>
        <button onClick={closePopup} className="text-xl">&times;</button>
      </div>
      <div className="p-4 space-y-4">
      <div className="flex flex-col items-center justify-center  bg-gradient-to-b from-white-100 to-blue-100 p-2">
      <h4>Powered by Canvassn</h4>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Realtime Voice Agent</h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Voice Chat</h2>
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
          {isSpeaking ? "Bot:"+{aiText} : "User:"+{userText}}
        </p>
      )}
    </div>
      
      </div>
    </div>
  </div>
  );
}


