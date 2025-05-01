import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import ChatHistory from "../../../../models/ChatHistory";


async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
      try {
        const authHeader=req.headers.authorization
        const { userId } = req.query;
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const filter = {};
        if (userId) filter.user_unique_id = userId;
        if (decoded.id) filter.prospect_id = decoded?.id;
        let chatHistory = await ChatHistory.find(filter,"transcript createdAt").sort({ createdAt: -1 })
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const filteredChats = chatHistory.filter(chat => {
          const time = new Date(chat.createdAt);
          return time >= thirtyDaysAgo;
        })
        .map(chat => ({
          chatId: chat._id,
          timeBadge: getTimeBadge(chat.createdAt),
          selected: getTimeBadge(chat.createdAt).toLocaleLowerCase() === "today" ? true : false
        }));
        return res.status(200).json({ success: true,message:"Chat history fetched successfully",filteredChats});
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
    
    
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

function getTimeBadge(dateStr){
  const date = new Date(dateStr);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();
  if (isSameDay) return "Today";

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  const diffTime = now.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 7) return "Last 7 Days";
  if (diffDays <= 30) return "Last 30 Days";

  return date.toLocaleString("default", { month: "long" }); // e.g., March
}


export default authMiddleware(handler)
