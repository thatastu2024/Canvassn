import connectDB from "../../../../lib/mongodb";
import ChatAgent from "../../../../models/ChatAgents";
import authMiddleware from "../../../../middleware/authMiddleware";
async function handler(req, res) {

    if (req.method === "GET") {
        await connectDB();
        try {
            const agents = await ChatAgent.find({},"_id, name agent_id");
            return res.status(200).json({ success: true, data: agents });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)