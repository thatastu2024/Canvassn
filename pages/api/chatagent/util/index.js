import connectDB from "../../../../lib/mongodb";
import ChatAgent from "../../../../models/ChatAgents";
import authMiddleware from "../../../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
async function handler(req, res) {

    if (req.method === "GET") {
        await connectDB();
        try {
            const token = req.headers.authorization.replace("Bearer ", "");
            const userDetails = jwt.verify(token, process.env.JWT_SECRET);
            let filter={}
            if(userDetails.user_type === "admin"){
                filter={
                    ...filter,
                    customer_id:userDetails.id
                }
            }
            const agents = await ChatAgent.find(filter,"_id, name agent_id agent_type");
            return res.status(200).json({ success: true, data: agents });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)