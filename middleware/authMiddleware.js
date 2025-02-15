import { verifyToken } from "../utils/jwt";
import cookie from "cookie";

export default function authMiddleware(handler) {
  return async (req, res) => {
    const authHeader=req.headers.authorization
    const token = authHeader.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Not authenticated" });
    
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    req.userId = decoded.id; // Attach user ID to request
    return handler(req, res);
  };
}
