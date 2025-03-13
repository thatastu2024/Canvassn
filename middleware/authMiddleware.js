import { verifyToken } from "../utils/jwt";

export default function authMiddleware(handler) {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
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
