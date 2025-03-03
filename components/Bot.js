import { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import axios from 'axios';
import Image from 'next/image';
import { faComment} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        agentId: agentDataProps.agent_id ,
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
    <>
      <div className="absolute bottom-full right-0 mb-2 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
        <div className="p-4 space-y-4">
          <div className="flex flex-col items-center justify-center  bg-gradient-to-b from-white-100 to-blue-100 p-2">
            <div className="bg-white rounded-2xl p-6 w-96">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Voice Chat</h2>
                <button onClick={closePopup} className="text-xl">&times;</button>
              </div>
              <div className="flex flex-col items-center justify-center  bg-gradient-to-b from-white-100 to-blue-100 p-2">
                <h4>Powered by Canvassn</h4>
                <h2 className="text-lg font-semibold text-gray-900">Canvassn Eric</h2>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


