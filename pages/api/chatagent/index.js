import connectDB from "../../../lib/mongodb";
import ChatAgent from "../../../models/ChatAgents";
import authMiddleware from "../../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
        try {
          const token = req.headers.authorization.replace("Bearer ", "");
          const userDetails = jwt.verify(token, process.env.JWT_SECRET);
          let filter={}
          if(userDetails.user_type === "admin"){
            filter={
              customer_id:userDetails.id
            }
          }
          const agents = await ChatAgent.find(filter,"_id, name agent_id avatar agent_type").limit(10);
          return res.status(200).json({ success: true, data: agents });
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
      }
    
      // if (req.method === "POST") {
      //   try {
      //     let requestBody=req.body
      //     const response = await axios.post(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/agents/create',
      //       requestBody,
      //       {
      //         headers:{
      //           'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
      //           "Content-Type": "application/json",
      //         }
      //       })
      //       console.log("response",response.data)
      //       if(response.data.hasOwnProperty('agent_id')){
      //         let finalResponse={...requestBody,...response.data}
      //         console.log(finalResponse)
      //         const agent = await ChatAgent.create(finalResponse);
      //         return res.status(201).json({ success: true, data: agent });
      //       }
      //   } catch (error) {
      //     console.log(error)
      //     return res.status(400).json({ success: false, error: error.message });
      //   }
      // }
    
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)