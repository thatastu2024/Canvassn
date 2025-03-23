import connectDB from "../../../lib/mongodb";
import AdminUser from "../../../models/AdminUsers";
import bcrypt from 'bcryptjs'
import authMiddleware from "../../../middleware/authMiddleware";
import UserDetail from "../../../models/UserDetail";
async function handler(req, res) {
  await connectDB(); // Connect to MongoDB

  if (req.method === "POST") {
    try {
      const requestBody = req.body;
      requestBody.password=await bcryptPassword(requestBody.password)
      let userTable={
        name:requestBody.customerName,
        email:requestBody.email,
        user_unique_token:requestBody.uniqueUserToken,
        password:requestBody.password,
        organization_name:requestBody.organization,
        planId:requestBody.userPlan,
        user_type:requestBody.userType
      }
      let checkUserExists=await AdminUser.findOne({
        email:userTable.email
      },"_id").lean()
      if(checkUserExists == undefined){
        const newUser = new AdminUser(userTable);
        await newUser.save();
        if(newUser != undefined){
          let userDetail={
            userId:newUser._id,
            agentId:requestBody.agent,
            domainName:requestBody.domain,
            status:'active'
          }
          const newUserDetail = new UserDetail(userDetail);
          await newUserDetail.save();
        }
        return res.status(201).json({ message: "User created successfully", newUser });
      }else{
        return res.status(201).json({status:422, message: {email:"User with this email already exists"} });
      }
    } catch (error) {
      console.log(error)
      return res.status(200).json({status:422, error: error.message });
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

export default authMiddleware(handler)
