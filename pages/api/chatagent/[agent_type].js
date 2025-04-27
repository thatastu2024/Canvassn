import connectDB from "../../../lib/mongodb";
import ChatAgent from "../../../models/ChatAgents";
import authMiddleware from "../../../middleware/authMiddleware";
async function handler(req, res) {
    console.log("query",req.query)
    let agentType=req?.query.agent_type
    connectDB()
    // if (req.method === "GET") {
    //   await connectDB();
    //     try {
    //       const agents = await ChatAgent.find({},"_id, name agent_id avatar").limit(10);
    //       return res.status(200).json({ success: true, data: agents });
    //     } catch (error) {
    //       return res.status(500).json({ success: false, error: error.message });
    //     }
    //   }
    
      if (req.method === "POST" && agentType === "chat") {
        try {
            let requestBody=req.body
            requestBody.agent_type="chat"
            if(requestBody !== undefined){
                const agent = await ChatAgent.create(requestBody);
                return res.status(201).json({ success: true, data: agent });
            }
        } catch (error) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message });
        }
      }
    
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)