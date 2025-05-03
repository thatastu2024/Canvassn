import connectDB from "../../../../../lib/mongodb";
import authMiddleware from "../../../../../middleware/authMiddleware";
import ChatHistory from "../../../../../models/ChatHistory";


async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
      try {
        let chatId=req?.query.chatId
        let chatHistory = await ChatHistory.find({
            _id:chatId
        },"transcript")
        return res.status(200).json({ success: true,message:"Chat history fetched successfully",chatHistory});
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
    
    
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)
