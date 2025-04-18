import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { isToday, isThisWeek, parse } from 'date-fns';

const socket = io(process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SOCKET_SERVER_URL : "http://localhost:3000", { path: "/api/socket" });

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [waitingForBot, setWaitingForBot] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected:", socket.id));

    socket.on("receiveMessage", (message) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === "thinking..." ? { text: message, sender: "bot" } : msg
        )
      );
      setWaitingForBot(false);
    });
    fetchMessages()
    return () => socket.off("receiveMessage");
  }, []);

  const fetchMessages = async() =>{
    try {
      let userId='qwss0dosb'
      let prospectId='67c71cb736cf73532106b589'
      let token=localStorage.getItem('authToken')
      const res = await axios.get(`/api/chatbot/history?userId=${userId}&&prospectId=${prospectId}`,{
        headers:{
          Authorization:'Bearer '+token,
          "Content-Type": "application/json",
        } 
      });
      const data = res.data.data;
      if (Array.isArray(data) && data.length > 0 && data[0].transcript) {
        const parsedMessages = data[0].transcript.map((item) => ({
          text: item.message,
          sender: item.role === "user" ? "user" : "bot",
          timestamp: item.time_unix,
        }));
        setMessages(parsedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setMessages([]);
    }
  }

  function getFormattedTimestamp() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  }

  const getBadgeLabel = (timestamp) => {
    const parsed = new Date(timestamp);
  
    if (isToday(parsed)) {
      return "Today";
    }
  
    if (isThisWeek(parsed, { weekStartsOn: 1 })) {
      return parsed.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Tuesday"
    }
  
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const timestamp = getFormattedTimestamp();

    const userMessage = {
      text: input,
      sender: "user",
      timestamp,
    };
  

    const placeholderBotReply = {
      text: "thinking...",
      sender: "bot",
      timestamp,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      placeholderBotReply
    ]);

    setWaitingForBot(true);
    console.log(input,localStorage.getItem('authToken'))
    socket.emit("sendMessage", {
      message:input,
      prospectId:localStorage.getItem('authToken'),
      userId:'qwss0dosb',
      timestamp
    });
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white shadow-2xl rounded-xl flex flex-col border border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-xl">
        <h2 className="font-semibold text-lg">ChatBot</h2>
        <button onClick={() => setIsOpen(false)} className="text-white text-xl font-bold hover:text-gray-200">&times;</button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      <div className="flex flex-col space-y-2 p-4 overflow-y-auto">
      {/* {showDateBadge && ( */}
        {/* <div className="self-center bg-white text-gray-700 text-xs px-3 py-1 rounded-full mb-2 shadow-sm">
          {getBadgeLabel(msg.timestamp)}
        </div> */}
      {/* )} */}
        {console.log(messages)}
        {
          messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-4">Please hit any question</div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-center text-sm ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* <div className="self-center bg-white text-gray-700 text-xs px-3 py-1 rounded-full mb-2 shadow-sm">
                {getBadgeLabel(msg.timestamp)}
              </div> */}
                {msg.sender === "bot" && (
                  <img src="/Women.webp" alt="Bot" className="w-6 h-6 rounded-full mr-2" />
                )}
                {/* <div className="flex flex-col max-w-full"> */}
                <span
                  className={`inline-block px-3 py-2 rounded-md max-w-[75%] break-words ${
                    msg.sender === "user"
                      ? "bg-gray-300 text-black"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {msg.text}
                  <span className={`text-[10px] text-gray-500 mt-0.5 ml-1
                    ${
                      msg.sender === "user"
                        ? "bg-gray-300 text-black"
                        : "bg-green-200 text-green-800"
                    }
                  `}>
                    <span className={`text-[10px] text-gray-500 mt-0.5 ml-1
                      ${
                        msg.sender === "user"
                          ? "bg-gray-300 text-black"
                          : "bg-green-200 text-green-800"
                      }
                      `}>
                      {msg.timestamp?.split(" ")[3]} {msg.timestamp?.split(" ")[4]}
                    </span>
                  </span>
                </span>
                {/* </div> */}
                {msg.sender === "user" && (
                  <img src="/Men.webp" alt="User" className="w-6 h-6 rounded-full ml-2" />
                )}
          </div>
        )))}
        </div>
      </div>

      {/* Input */}
      <div className="flex px-3 py-2 border-t">
        <input
          type="text"
          className="flex-1 border rounded-l-md px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded-r-md text-sm disabled:bg-gray-400"
          onClick={sendMessage}
          disabled={waitingForBot}
        >
          Send
        </button>
      </div>
    </div>
  );
}
