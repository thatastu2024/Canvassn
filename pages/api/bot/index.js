import Conversation from "../../../models/Conversations";
import connectDB from "../../../lib/mongodb";
import ChatAgents from "../../../models/ChatAgents";
import ChatHistory from "@/models/ChatHistory";
import authMiddleware from "../../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
        try {
          const authHeader=req.headers.authorization;
          const token = authHeader.replace("Bearer ", "");
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          let filter={}
          if(decoded.user_type === "admin"){
            if(req?.query?.type === "voice"){
              let agentData = await ChatAgents.find({
                customer_id:decoded.id
              },'_id agent_id agent_type')
              if(agentData.length){
                const filteredAgentIds = agentData
                .filter(item => item.type === "voice" || item.type === "both")
                .map(item => item.user_id);
                filter={
                  ...filter,
                  agent_id:{
                    $in:filteredAgentIds
                  }
                }
              }
              let conversations = await Conversation.find(filter,'_id agent_id agent_name status conversation_id call_duration_secs call_successful start_time_unix_secs transcript').sort({createdAt : -1})
              return res.status(200).json({ success: true, data: conversations });
            }
            let filter = {};
            if(req?.query?.type === "chat"){
              if(req?.query?.agentId && req?.query?.agentId.toLowerCase() !== "all"){
                filter={
                  agent_id:req?.query?.agentId
                }
              }
              
              const matchStage = {
                ...(filter.agent_id ? { agent_id: filter.agent_id } : {}),
                user_unique_id: decoded.user_unique_token
              };
              const chatHistory = await ChatHistory.aggregate([
                { $match: matchStage },
                {
                  $addFields: {
                    agentObjectId: {
                      $toObjectId: '$agent_id'
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'prospects',
                    localField: 'prospect_id',
                    foreignField: '_id',
                    as: 'prospect'
                  }
                },
                {
                  $unwind: {
                    path: '$prospect',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $lookup: {
                    from: 'chatagents',
                    localField: 'agentObjectId',
                    foreignField: '_id',
                    as: 'agent'
                  }
                },
                {
                  $unwind: {
                    path: '$agent',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $project: {
                    _id: 1,
                    session_id: 1,
                    prospect: 1,
                    total_message_exchange: 1,
                    createdAt: 1,
                    prospect: {
                      _id: '$prospect._id',
                      name: '$prospect.prospect_name'
                    },
                    agent: {
                      _id: '$agent._id',
                      name: '$agent.name'
                    }
                  }
                },
                {
                  $sort: {
                    createdAt: -1
                  }
                }
              ]);
              
              return res.status(200).json({ success: true, data: chatHistory });
            }
          }
          if(decoded.user_type === "superadmin"){
            if(req?.query?.type === "voice"){
              let conversations = await Conversation.find(filter,'_id agent_id agent_name status conversation_id call_duration_secs call_successful start_time_unix_secs transcript').sort({createdAt : -1})
              return res.status(200).json({ success: true, data: conversations });
            }
            if(req?.query?.type === "chat"){
              let filter = {};
                if(req?.query?.agentId && req?.query?.agentId.toLowerCase() !== "all"){
                  filter={
                    agent_id:req?.query?.agentId
                  }
                }
                
                const matchStage = {
                  ...(filter.agent_id ? { agent_id: filter.agent_id } : {})
                };
              const chatHistory = await ChatHistory.aggregate([
                { $match: matchStage },
                {
                  $addFields: {
                    agentObjectId: {
                      $toObjectId: '$agent_id'
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'prospects',
                    localField: 'prospect_id',
                    foreignField: '_id',
                    as: 'prospect'
                  }
                },
                {
                  $unwind: {
                    path: '$prospect',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $lookup: {
                    from: 'chatagents',
                    localField: 'agentObjectId',
                    foreignField: '_id',
                    as: 'agent'
                  }
                },
                {
                  $unwind: {
                    path: '$agent',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $project: {
                    _id: 1,
                    session_id: 1,
                    prospect: 1,
                    total_message_exchange: 1,
                    createdAt: 1,
                    prospect: {
                      _id: '$prospect._id',
                      name: '$prospect.prospect_name'
                    },
                    agent: {
                      _id: '$agent._id',
                      name: '$agent.name'
                    }
                  }
                },
                {
                  $sort: {
                    createdAt: -1 
                  }
                }
              ]);
              console.log(chatHistory)              
  
              return res.status(200).json({ success: true, data:chatHistory });
            }
          }
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
                const agentDetail = await ChatAgents.findOne({
                  agent_id:finalResponse.agent_id
                },"_id name").lean().exec()
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

export default authMiddleware(handler)

