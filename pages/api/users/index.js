import connectDB from "../../../lib/mongodb";
import AdminUser from "../../../models/AdminUsers";
import bcrypt from 'bcryptjs'
export default async function handler(req, res) {
  await connectDB(); // Connect to MongoDB

  if (req.method === "POST") {
    try {
      console.log(req.body)
      const requestBody = req.body;
      requestBody.password=await bcryptPassword(requestBody.password)
      console.log(requestBody)
      const newUser = new AdminUser(requestBody);
      await newUser.save();
      return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const users = await AdminUser.find();
      return res.status(200).json({
        message:"Users fetched successfully",
        data:users
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function bcryptPassword(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
