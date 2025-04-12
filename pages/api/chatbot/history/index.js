import ChatHistory from "../../../../models/ChatHistory";
import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
async function handler(req, res) {
    await connectDB();
    if (req.method === "GET") {
        try{
            let queryData = req.query;
            await ChatHistory.find()
            return res.status(200).json({ success: true, data: agents });
        }catch(err){
            console.log(err);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

}

export default authMiddleware(handler)

