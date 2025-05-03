import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Conversations from '@/components/Conversations/Conversations';
import ChatHistoryComponent from './ChatHistory'

export default function ConversationsListComponent(data) {
  return (
    <>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
    </div>
    <Tabs defaultValue="voice" className="w-full max-w-8xl mx-auto">
      <TabsList className="mb-4">
        <TabsTrigger value="voice" className="text-lg px-4 py-2">
          Voice
        </TabsTrigger>
        <TabsTrigger value="chat" className="text-lg px-4 py-2">
          Chat
        </TabsTrigger>
      </TabsList>
    
      <TabsContent value="voice" className="w-full">
        <Conversations></Conversations>
      </TabsContent>

      <TabsContent value="chat">
        <ChatHistoryComponent></ChatHistoryComponent>
      </TabsContent>
    </Tabs>
    </>
  );
}
