import { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import axios from 'axios';


export default function InitiateBotButton({agentId}) {
    const [hasPermission, setHasPermission] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [aiText,setAiText] = useState("");
    const [userText,setUserText] = useState("");

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