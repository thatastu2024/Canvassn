import connectDB from "../../lib/mongodb";
import User from "../../models/AdminUsers";

export default async function handler(req, res) {
  await connectDB(); // Connect to MongoDB

  if (req.method === "POST") {
    try {
      const { name, email, password, user_unique_token } = req.body;
      const newUser = new User({ name, email, password, user_unique_token });
      await newUser.save();
      return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
