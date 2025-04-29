import Prospects from "../../../../models/Prospects";
import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import jwt from "jsonwebtoken";


async function handler(req, res) {
  await connectDB();
    if (req.method === "GET") {
      try {
        // let paramsData=req.query
        // const decoded = jwt.verify(paramsData.token, process.env.JWT_SECRET);
        // console.log(decoded)
        // const prospects = await Prospects.findOne({
        //     _id:decoded.id
        // },"_id prospect_name prospect_email prospect_location");
        return res.status(200).json({ success: true,message:"Data fetched successfully" ,prospects });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
    
    
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)
