import authMiddleware from "../../../middleware/authMiddleware";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/AdminUsers";

async function handler(req, res) {
  await connectDB();
  if(req.method === "GET"){

    const user = await User.findById(req.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  }
}

export default authMiddleware(handler);
