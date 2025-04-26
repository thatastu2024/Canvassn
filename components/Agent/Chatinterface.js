import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BotCard from '../BotCard';


const ChatInterface = ({ selectedAgent }) => {
    console.log(selectedAgent)
  const [message, setMessage] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [timer, setTimer] = useState("00:00");

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
        </div>
        <Button variant="ghost" size="icon">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isVoiceMode ? (
          <BotCard agentDataProps={selectedAgent} isVoiceMode={isVoiceMode} onModeChange={setIsVoiceMode}></BotCard>
        ) : (
          <div className="space-y-4">
            {/* Chat messages would go here */}
          </div>
        )}
      </ScrollArea>

      {!isVoiceMode && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsVoiceMode(!isVoiceMode)}
            >
              <Mic />
            </Button>
            <Button variant="default" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;