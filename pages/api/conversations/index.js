import connectDB from "../../../lib/mongodb";
import ChatAgent from "../../../models/ChatAgents";
import authMiddleware from "../../../middleware/authMiddleware";
async function handler(req, res) {

    if (req.method === "GET") {
        try {
            // let queryParams=req.query
            // console.log("request",req)
            const agents = await ChatAgent.find({});
            return res.status(200).json({ success: true, data: agents });
          return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
      }
    
      if (req.method === "POST") {
        try {
          let requestBody=req.body
          console.log(requestBody)
          // const agent = new ElevenLabsAgent({
          //   agentId:'06BV0iCFoKRUp63IpyDs'
          // });

          // agent.on('end_call_bot', async (callData) => {
          //   try {
          //     const response = await fetch('https://your-custom-webhook-url.com', {
          //       method: 'POST',
          //       headers: {
          //         'Content-Type': 'application/json',
          //       },
          //       body: JSON.stringify(callData),
          //     });
              
          //     if (!response.ok) {
          //       throw new Error('Failed to send data to webhook');
          //     }
              
          //     console.log('Data sent to webhook successfully');
          //   } catch (error) {
          //     console.error('Error sending data to webhook:', error);
          //   }
          // });
          // const response = await axios.post(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/conversations',
          //   requestBody,
          //   {
          //     headers:{
          //       'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
          //       "Content-Type": "application/json",
          //     }
          //   })
          //   console.log("response",response.data)
          //   if(response.data.hasOwnProperty('agent_id')){
          //     let finalResponse={...requestBody,...response.data}
          //     console.log(finalResponse)
          //     const agent = await ChatAgent.create(finalResponse);
          //     return res.status(201).json({ success: true, data: agent });
          //   }
        } catch (error) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message });
        }
      }
    
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

