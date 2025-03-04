import Conversation from "../../models/Conversations";
import connectDB from "../../lib/mongodb";
export default async function handler(req, res) {
    if (req.method === "GET") {
      await connectDB();
      let conversations = await Conversation.find({status:'processing'},'conversation_id').sort({createdAt : -1})
      console.log(conversations)
      conversations.map(async curr=>{
        const url = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations/'+curr.conversation_id;
        const options = {method: 'GET', headers: {'xi-api-key': process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE}};
        const response = await fetch(url, options);
        const payload = await response.json();
        let finalUpdateData={
                    agent_id:payload?.agent_id,
                    conversation_id:payload?.conversation_id,
                    status:payload?.status,
                    call_successful:payload?.analysis?.call_successful,
                    start_time_unix_secs: payload?.metadata?.start_time_unix_secs,
                    call_duration_secs: payload?.metadata?.call_duration_secs,
                    transcript: payload?.transcript,
                    metadata: payload?.metadata,
                    analysis: payload?.analysis,
                    conversation_initiation_client_data:payload?.conversation_initiation_client_data
                }
        const updatedAgent = await Conversation.findByIdAndUpdate(curr._id, finalUpdateData, { new: true });
        return res.status(200).json({ message: "Chat data synced successfully" });
      })
    }
    // console.log("Received Webhook Data:", req.body);
  
    // Respond to webhook
    
  }
