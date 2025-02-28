import connectDB from "../../../lib/mongodb";
import Conversation from "../../../models/Conversations";
export default async function handler(req, res) {

    if (req.method === "GET") {
        
    }
    
    if (req.method === "POST") {
        try {
            let requestBody=req.body
            console.log(requestBody)
            if(requestBody.data.hasOwnProperty('conversation_id')){
                let finalResponse=requestBody.data
                console.log(finalResponse)
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