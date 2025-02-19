import connectDB from "../../../lib/mongodb";
import ChatAgent from "../../../models/ChatAgents";
import axios from "axios";
export default async function handler(req, res) {

    if (req.method === "GET") {
        try {
            let agent_id=req.params
            const response = await axios.get(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations?agent_id='+agent_id,
                {
                    headers:{
                    'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
                    "Content-Type": "application/json",
                    }
            })
            console.log(response)
        //   const agents = await ChatAgent.find({},"_id, name");
        //   return res.status(200).json({ success: true, data: agents });
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
      }
    
      if (req.method === "POST") {
        try {
          let requestBody=req.body
          const response = await axios.post(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations',
            requestBody,
            {
              headers:{
                'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
                "Content-Type": "application/json",
              }
            })
            console.log("response",response.data)
            if(response.data.hasOwnProperty('agent_id')){
              let finalResponse={...requestBody,...response.data}
              console.log(finalResponse)
              const agent = await ChatAgent.create(finalResponse);
              return res.status(201).json({ success: true, data: agent });
            }
        } catch (error) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message });
        }
      }
    
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
}