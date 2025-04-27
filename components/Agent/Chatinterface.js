import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BotCard from '../BotCard';
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import axios from "axios";
import { format } from "date-fns";



const ChatInterface = ({ selectedAgent }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [waitingForBot, setWaitingForBot] = useState(false);
  const [timer, setTimer] = useState("00:00");

  useEffect(()=>{
    selectedAgent.agent_type === "voice" ? setIsVoiceMode(true) : setIsVoiceMode(false)
    const pusher = new Pusher("49dd9dac8eb95ca3a38a", {
      cluster: "ap2",
    });
  
    const channel = pusher.subscribe("canvassn-bot-18113325");
  
    channel.bind("new-message", async (data) => {
      // let token=localStorage.getItem('authToken');
      // await axios.post('/api/chatbot/history',data,{
      //   headers:{
      //     "Content-Type": "application/json",
      //     "Authorization": token
      //   }
      // })
      setMessages((prev) => {
        const newMsgs = [...prev];
        const thinkingIndex = newMsgs.findIndex((msg) => msg.thinking);
        if (thinkingIndex > -1) {
          newMsgs[thinkingIndex] = data;
        } else {
          newMsgs.push(data);
        }
        return newMsgs;
      });
    });
    // fetchMessages()
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  },[selectedAgent])

  const sendMessage = async () => {
    if (!input.trim()) return;
    console.log(input)
    const timestamp = getFormattedTimestamp();

    const userMessage = {
      text: input,
      role: "user",
      timestamp
    };
    setMessages((prev) => [...prev, userMessage]);

    const thinkingMsg = {
      role: "bot",
      text: "Thinking...",
      thinking: true,
      timestamp: null,
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    setWaitingForBot(true);

    const res = await axios.get("https://n8n.canvassn.co.in/webhook/chatbot", {
      params: {
        query: input
      },
    });

    await axios.post("/api/pusher", {
      channel: "canvassn-bot-18113325",
      event: "new-message",
      data: {
        role: "bot",
        text: res.data[0].response.text,
        timestamp: timestamp,
        prospectId:localStorage.getItem('authToken'),
        userId:'qwss0dosb'
      },
    });
    setInput("");
  };

  function getFormattedTimestamp() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  }

  const formatMessageTime = (date) => {
    return format(date, "h:mm a");
  };

  const formatFullTimestamp = (date) => {
    return format(date, "MMMM d, yyyy h:mm:ss a");
  };

  if (selectedAgent._id === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-500">
            No Agent Selected
          </h2>
          <p className="text-sm text-gray-400">
            Please select an agent to start chatting
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
            <AvatarFallback>
              {/* {selectedAgent.name.substring(0, 2)} */}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{selectedAgent.name}</h2>
          {
            selectedAgent.agent_type === "both" ? (
              <>
                <Switch 
                  checked={isVoiceMode} 
                  onCheckedChange={() => setIsVoiceMode(!isVoiceMode)} 
                /> 
                <Badge variant={!isVoiceMode ? "secondary" : "destructive"}>
                  {!isVoiceMode ? 'chat' : 'voice'}
                </Badge>
              </>
            ) : selectedAgent.agent_type === "voice" ? (
              <Badge variant="destructive">voice</Badge>
            ) : (
              <Badge variant="secondary">chat</Badge>
            )
          }
        </div>
        <Button variant="ghost" size="icon">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isVoiceMode && selectedAgent.agent_type === "voice" ? (
          <BotCard agentDataProps={selectedAgent} isVoiceMode={isVoiceMode} onModeChange={setIsVoiceMode}></BotCard>
        ) : (
          <div className="space-y-4">
            {
              messages.length === 0 ? (
                <div className="text-gray-400 text-center mt-4">Please hit any question</div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] space-y-1 ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                        // title={formatMessageTime(msg.timestamp)}
                      >
                        {msg.text}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {/* {formatFullTimestamp(msg.timestamp)} */}
                      </span>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        )}
      </ScrollArea>

      {!isVoiceMode && selectedAgent.agent_type === "chat" && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button 
             variant="default" 
             size="icon"
             onClick={sendMessage}
             disabled={waitingForBot}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;