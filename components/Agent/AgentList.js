import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { User } from "lucide-react";



const AgentList = ({ agents, selectedAgent, onSelectAgent }) => {
  {console.log(agents)}
  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
       <div className="space-y-2 p-4">
      {agents.map((agent) => (
        <Card
          key={agent.id}
          className={`transition-colors hover:bg-accent ${
            selectedAgent?.id === agent.id ? "bg-accent" : "bg-card"
          }`}
        >
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onSelectAgent(agent)}
          >
            {agent.avatarUrl ? (
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <User className="h-6 w-6" />
            )}
            <span>{agent.name}</span>
            <span
              className={`ml-auto h-2 w-2 rounded-full ${
                 "bg-green-500"
              }`}
            />
          </Button>
        </Card>
      ))}
    </div>
    </ScrollArea>
  );
};

export default AgentList;