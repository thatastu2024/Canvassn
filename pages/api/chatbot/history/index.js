import ChatHistory from "../../../../models/ChatHistory";
import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import {jwtDecode} from "jwt-decode";
async function handler(req, res) {
    await connectDB();
    if (req.method === "GET") {
        try{
            const { userId, prospectId } = req.query;
            const filter = {};

            if (userId) filter.user_unique_id = userId;
            if (prospectId) filter.prospect_id = prospectId;

            let chatHistory=await ChatHistory.find(filter,"transcript").sort({ createdAt: 1 })
            return res.status(200).json({ success: true, data: chatHistory });
        }catch(err){
            console.log(err);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if(req.method === "POST"){
        try{
            let requestData = req.body
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            let prospectData=jwtDecode(requestData.prospectId)
            let existingMessage = await ChatHistory.findOne({
            user_unique_id:requestData.userId,
            prospect_id:prospectData.id,
            createdAt: {
                $gte: startOfToday,
                $lte: endOfToday,
            }
            });
            if(!existingMessage){
                const sessionToken = Math.random().toString(36).substr(2, 9);
                let prospectData=jwtDecode(requestData.prospectId)
                const dataToSave={
                    user_unique_id:requestData.userId,
                    prospect_id:prospectData.id,
                    transcript:[{
                        role:requestData.role,
                        message:requestData.text,
                        time_unix:requestData.timestamp
                    }],
                    message: requestData.text,
                    session_id: sessionToken,
                    total_message_exchange:1,
                    agent_id:requestData.agent_id
                }
                await ChatHistory.create(dataToSave)
                return res.status(200).json({ success: true, message:"User chat saved successfully" });
            }else{
                await ChatHistory.updateOne(
                    { _id: existingMessage._id },
                    { $push: { transcript: {
                        role:requestData.role,
                        message:requestData.text,
                        time_unix:requestData.timestamp
                    } } }
                  );

                const updatedMessage = await ChatHistory.findById(existingMessage._id);
                const updatedTranscriptLength = updatedMessage.transcript.length;
                await ChatHistory.updateOne(
                { _id: existingMessage._id },
                { $set: { total_message_exchange: updatedTranscriptLength } }
                );
                res.status(200).json({
                    message: 'Transcript updated'
                });
            }
        }catch(err){
            console.log(err);
            return res.status(500).json({ success: false, error: err.message });
        }
    }

}

export default authMiddleware(handler)

