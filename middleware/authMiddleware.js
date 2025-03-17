import { verifyToken } from "../utils/jwt";
import Cors from "cors";

// const cors = Cors({
//   origin: ["https://your-vercel-app.vercel.app/api"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// });

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }

export default function authMiddleware(handler) {
  return async (req, res) => {
    // await runMiddleware(req, res, cors);

    // if (req.method === "OPTIONS") {
    //   return res.status(200).end();
    // }

    const authHeader=req.headers.authorization
    if(!authHeader){
      return res.status(401).json({ message: "Auth Token Required" });
    }
    const token = authHeader.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Not authenticated" });
    
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token", expired:true });

    req.userId = decoded.id; // Attach user ID to request
    return handler(req, res);
  };
}
