import connectDB from "../../../lib/mongodb";
import AdminUser from "../../../models/AdminUsers";
import { generateToken } from "../../../utils/jwt";
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  const { email, password } = req.body;

  const adminUser = await AdminUser.findOne({ email }).select("+password +user_unique_token");
  console.log(adminUser.user_unique_token)
  if (!adminUser) return res.status(400).json({ message: "User not found" });

  const isMatch = await comparePassword(password,adminUser.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate JWT token
  const token = generateToken(adminUser);
  console.log(token)

  return res.status(200).json({ message: "Login successful", token });
}

async function comparePassword(password,dbpassword){
  console.log(password,dbpassword)
    return bcrypt.compare(password, dbpassword);
}