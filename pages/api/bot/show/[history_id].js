import Conversation from "../../../../models/Conversations";
import Prospects from "../../../../models/Prospects";
import connectDB from "../../../../lib/mongodb";

const fetchProspectData = async (prospectId)=>{
  try{
    return await Prospects.findOne({
      _id:prospectId
    },"prospect_name prospect_email prospect_location").lean()
  }catch(error){

  }
}

export default async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
      try {
        const {history_id} = req?.query;
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
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Some error occured", error });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
}