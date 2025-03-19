import Prospects from "../../../../models/Prospects";
import connectDB from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import Cors from "cors";

const cors = Cors({
  origin: "*", // Allow all origins (for debugging)
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function handler(req, res) {

    await runMiddleware(req, res, cors);

    // ✅ Explicitly set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // ✅ Handle preflight requests (OPTIONS)
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // Send a 200 OK response for preflight
    }

    if (req.method === "GET") {
      await connectDB();
      try {
        let paramsData=req.query
        const decoded = jwt.verify(paramsData.token, process.env.JWT_SECRET);
        const prospects = await Prospects.findOne({
            _id:decoded.id
        },"_id prospect_name prospect_email prospect_location");
        return res.status(200).json({ success: true,message:"Data fetched successfully" ,data: prospects });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
    
    
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

export default authMiddleware(handler)