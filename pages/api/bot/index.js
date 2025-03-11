import Conversation from "../../../models/Conversations";
import connectDB from "../../../lib/mongodb";
import ChatAgents from "../../../models/ChatAgents";
export default async function handler(req, res) {

    if (req.method === "GET") {
      await connectDB();
        try {
          let conversations = await Conversation.find({},'_id agent_id agent_name status conversation_id call_duration_secs call_successful start_time_unix_secs transcript').sort({createdAt : -1})
          return res.status(200).json({ success: true, data: conversations });
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, error: error.message });
        }
    }
    
    if (req.method === "POST") {
        try {
            let requestBody=req.body
            if(requestBody.data.hasOwnProperty('conversation_id')){
                let finalResponse=requestBody.data
                const agentDetail = await ChatAgents.findOne({},"_id name").lean().exec()
                finalResponse={
                  ...finalResponse,
                  agent_name:agentDetail.name
                }
                // const result = await Conversation.updateMany({}, { $set: { prospect_id: "67c6e37f295ef49f55e17a98" } });
                await Conversation.create(finalResponse);
                return res.status(201).json({ success: true, message: "Conversation record inserted successfully" });
            }
        } catch (error) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message });
        }
      }
    
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
}