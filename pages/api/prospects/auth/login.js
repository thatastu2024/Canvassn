import Prospects from "../../../../models/Prospects";
import connectDB from "../../../../lib/mongodb";
import Joi from "joi";
// import ChatAgents from "../../../models/ChatAgents";
import { generateToken } from "../../../../utils/jwt";
import bcrypt from 'bcryptjs'
// import authMiddleware from "../../../middleware/authMiddleware";
import Cors from "cors";

const cors = Cors({
    origin: "*", // Change to your frontend URL in production
    methods: ["POST", "OPTIONS"], // Allow only POST and OPTIONS
    allowedHeaders: ["Content-Type"]
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

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(200).json({status:'OK'})
    }

    
    if (req.method === "POST") {
        await connectDB();
        try {
            let requestBody=req?.body
            const prospectSchema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            });
            const result=prospectSchema.validate(requestBody)
            if(result && result.error){
                const {details} = result.error;
                const message = details.map(i => i.message).join(', ');
                return res.status(422).json({ success: true, message: message});
            }else{
                let userDetails = await Prospects.findOne({
                    prospect_email:requestBody.email
                }).lean()  
                if(userDetails !== null && userDetails.hasOwnProperty('_id')){
                    const isMatch = await bcrypt.compare(requestBody.password,userDetails.password);
                    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
                    const token = generateToken(userDetails)
                    userDetails.authToken=token
                    return res.status(201).json({ success: true, message: "Prospect Authenticated Successfully",userDetails});
                }
            }
        } catch (error) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message });
        }
      }
}

// authMiddleware(handler)
