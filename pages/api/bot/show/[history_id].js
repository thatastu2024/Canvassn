import Conversation from "../../../../models/Conversations";
import Prospects from "../../../../models/Prospects";
import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import ChatHistory from "@/models/ChatHistory";
import ChatAgents from "@/models/ChatAgents";

const fetchProspectData = async (prospectId)=>{
  try{
    return await Prospects.findOne({
      _id:prospectId
    },"prospect_name prospect_email prospect_location").lean()
  }catch(error){

  }
}

const fetchAgentData = async (agentId)=>{
  try{
    return await ChatAgents.findOne({
      _id:agentId
    },"name").lean()
  }catch(error){

  }
}

async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
      try {
        const {history_id, type} = req?.query;
        if(type === "voice"){
          let conversationDataDetails= await Conversation.findOne({
            _id:history_id
          }).lean()
          if(conversationDataDetails.hasOwnProperty('prospect_id') && conversationDataDetails.prospect_id){
            let prospectData=await fetchProspectData(conversationDataDetails.prospect_id)
            conversationDataDetails={
              ...conversationDataDetails,
              prospectData:prospectData
            }
          }
          
          if(conversationDataDetails !== undefined){
            return res.status(200).json({message:"Conversation data fetched successfully",data:conversationDataDetails});
          }else{
            return res.status(404).json({ message: "Conversation data not found" });
          }
        } else if(type === "chat"){
            let chatHisotryDetails= await ChatHistory.findOne({
              _id:history_id
            }).lean()
            if(chatHisotryDetails.hasOwnProperty('prospect_id') && chatHisotryDetails.prospect_id){
              let prospectData=await fetchProspectData(chatHisotryDetails.prospect_id)
              chatHisotryDetails={
                ...chatHisotryDetails,
                prospectData:prospectData
              }
              let agentData=await fetchAgentData(chatHisotryDetails.agent_id)
              chatHisotryDetails={
                ...chatHisotryDetails,
                agentData:agentData
              }
            }
            
            if(chatHisotryDetails !== undefined){
              return res.status(200).json({message:"Chat hisotry fetched successfully",chatHisotryDetails});
            }else{
              return res.status(404).json({ message: "Chat history not found" });
            }
        }
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Some error occured", error });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
}

export default authMiddleware(handler)