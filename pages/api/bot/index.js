import Conversation from "../../../models/Conversations";
export default async function handler(req, res) {

    if (req.method === "GET") {
        try {
          let conversations = await Conversation.find({},'_id agent_id agent_name status conversation_id call_duration_secs call_successful start_time_unix_secs transcript').limit(10)
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