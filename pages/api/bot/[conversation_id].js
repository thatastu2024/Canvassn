import Conversation from "../../../models/Conversations";
import authMiddleware from "../../../middleware/authMiddleware";
import connectDB from "../../../lib/mongodb";
async function handler(req, res) {
  await connectDB();
    if (req.method === "PATCH") {
      try {
        const {conversation_id} = req?.query;
        const payload = req?.body?.payload
        const schemaId= await Conversation.findOne({
          conversation_id:conversation_id
        },{_id:1}).exec()
        if(schemaId !== undefined){
          let finalUpdateData={
            agent_id:payload?.agent_id,
            conversation_id:conversation_id,
            status:payload?.status,
            call_successful:payload?.analysis?.call_successful,
            call_duration_secs: payload?.metadata?.call_duration_secs,
            transcript: payload?.transcript,
            metadata: payload?.metadata,
            analysis: payload?.analysis,
            conversation_initiation_client_data:payload?.conversation_initiation_client_data
        }
        const updatedAgent = await Conversation.findByIdAndUpdate(schemaId, finalUpdateData, { new: true });
  
        if (!updatedAgent) return res.status(404).json({ message: "Conversation data not found" });
        }
  
        return res.status(200).json({message:"Conversation updated successfully"});
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error updating agent", error });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }

    if(req.method === "PUT"){
      try{
        let updateFields=req?.body
        const {conversation_id} = req?.query;
        const updatedConversation = await Conversation.findOneAndUpdate(
          { conversation_id: conversation_id }, 
          { $set: updateFields },
          { new: true } 
        );
        return res.status(200).json({message:"Conversation updated successfully"});
      }catch(error){
        console.log(error)
        return res.status(500).json({ message: "Error updating agent detail", error });
      }
    }else{
      res.status(405).json({ message: "Method Not Allowed" });
    }
}

export default authMiddleware(handler)

