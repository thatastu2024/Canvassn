import ChatHistory from "../../../../models/ChatHistory";
import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import { isToday, isThisWeek, parse } from 'date-fns';
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
            const sessionToken = Math.random().toString(36).substr(2, 9)
            let dataToSave={
                user_unique_id:requestData.userId,
                prospect_id:requestData.prospectId,
                message: requestData.message
            }
        }catch(err){
            console.log(err);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

}

export default authMiddleware(handler)

