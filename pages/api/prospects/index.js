import Prospects from "../../../models/Prospects";
import connectDB from "../../../lib/mongodb";
import Joi from "joi";
import ChatAgents from "../../../models/ChatAgents";
import { generateToken } from "../../../utils/jwt";
import authMiddleware from "../../../middleware/authMiddleware";
export default async function handler(req, res) {

    if (req.method === "GET") {
      await connectDB();
      try {
        let paramsData=req.query
        let filterData={};
        let sortData={  };
        if(paramsData.filterField === "search"){
            console.log("Inside")
            filterData = {
                $or: [
                  { name: { $regex: paramsData.filterValue, $options: "i" } }, // Case-insensitive search
                  { email: { $regex: paramsData.filterValue, $options: "i" } },
                ],
              };
            console.log("filterData",filterData)
        }else{
            sortData={
                [paramsData.filterField] : parseInt(paramsData.filterValue)
            }
        }
        const prospects = await Prospects.find({},"_id, prospect_name prospect_email prospect_location createdAt").sort(sortData);
        return res.status(200).json({ success: true, data: prospects });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
    
    if (req.method === "POST") {
        await connectDB();
        try {
            let requestBody=req?.body
            const prospectSchema = Joi.object({
                agent_id: Joi.string().required(),
                prospect_name: Joi.string().required(),
                prospect_email: Joi.string().required(),
                prospect_location: Joi.string().required()
            });
            const result=prospectSchema.validate(requestBody)
            if(result && result.error){
                const {details} = result.error;
                const message = details.map(i => i.message).join(', ');
                return res.status(422).json({ success: true, message: message});
            }else{
                let checkUserExists = await Prospects.findOne({
                    prospect_email:requestBody.prospect_email
                }).lean()
                if(checkUserExists !== null && checkUserExists.hasOwnProperty('_id')){
                    const token = generateToken(checkUserExists)
                    return res.status(201).json({ success: true, message: "Prospect Authenticated Successfully",data:{
                        prospect_id:checkUserExists._id,
                        prospectToken:token
                    }});
                }else{
                    let customerData=await ChatAgents.findOne({
                        agent_id:requestBody.agent_id
                    },'_id customer_id').lean()
                    let finalResponse = {
                        agent_id:requestBody.agent_id,
                        prospect_name: requestBody.prospect_name,
                        prospect_email: requestBody.prospect_email,
                        prospect_location: requestBody.prospect_location,
                        customer_id: customerData.customer_id,
                        status: 'active'
                    }
                    let data=await Prospects.create(finalResponse);
                    console.log(data._id)
                    if(data) {
                        const token = generateToken(data)
                        return res.status(201).json({ success: true, message: "Prospect record captured successfully",data:{
                            prospect_id:data._id,
                            prospectToken:token
                        }});
                    }else{
                        return res.status(201).json({ success: true, message: "Prospect record not captured"});
                    }
                }
            }
        } catch (error) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message });
        }
      }
    
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

// authMiddleware(handler)