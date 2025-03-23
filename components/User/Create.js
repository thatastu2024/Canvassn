import { useEffect, useState } from "react";
import Joi from "joi";
import axios from "axios";

export default function Create({openUserForm,setOpenUserForm}) {
    
    const [errors, setErrors] = useState({});
    const [agentData, setAgentData] = useState([])
  
    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        uniqueUserToken: Math.random().toString(36).substr(2, 9),
        password: "",
        organization: "",
        userPlan: "basic",
        agent: "agent1",
        userType: "admin",
        domain:""
    });

    const schema = Joi.object({
        customerName: Joi.string().min(3).max(50).required().messages({
          "string.empty": "Customer Name is required",
          "string.min": "Customer Name should be at least 3 characters",
        }),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
          "string.empty": "Email is required",
          "string.email": "Enter a valid email",
        }),
        uniqueUserToken: Joi.string().required(),
        password: Joi.string().min(8).required().messages({
          "string.empty": "Password is required",
          "string.min": "Password should be at least 8 characters",
        }),
        organization: Joi.string().min(2).max(100).required().messages({
          "string.empty": "Organization Name is required",
          "string.min": "Organization Name should be at least 2 characters",
        }),
        userPlan: Joi.string().valid("basic", "premium", "enterprise").required(),
        agent: Joi.string().required(),
        userType: Joi.string().valid("admin", "user").required(),
        // image: Joi.any().required().messages({
        //   "any.required": "Image upload is required",
        // }),
        domain: Joi.string().min(2).max(100).required().messages({
            "string.empty": "Domain Name is required",
            "string.min": "Domain Name should be at least 2 characters",
        }),
      });
    
    useEffect(()=>{
      if(openUserForm){
        fetchAgents()
      }
    },[openUserForm])  

    const fetchAgents = async() =>{
      try{
        let token=localStorage.getItem('token')
        const agentData = await axios.get('/api/chatagent/util',{
          headers:{
              Authorization:`Bearer ${token}`,
              "Content-Type": "application/json",
          }
        })
        setAgentData(agentData?.data?.data)
      }catch(error){
        console.log(error)
      }
    }
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleImageUpload = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
      };
    
      const refreshUserToken = () => {
        setFormData({ ...formData, uniqueUserToken: Math.random().toString(36).substr(2, 9) });
      };
    
      const generatePassword = () => {
        setFormData({ ...formData, password: Math.random().toString(36).substr(2, 12) });
      };
    
      const validateForm = () => {
        const { error } = schema.validate(formData, { abortEarly: false });
    
        if (error) {
          const errorMessages = {};
          error.details.forEach((err) => {
            errorMessages[err.path[0]] = err.message;
          });
          setErrors(errorMessages);
          return false;
        }else{
          setErrors({});
          return true;
        }
      };
    
      const handleSubmit = async(e) => {
        console.log(!validateForm())
        if (!validateForm()) {
          return
        }else{
          let token=localStorage.getItem('token')
          const agentData = await axios.post('/api/users',{
            ...formData
          },{
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type": "application/json",
            }
          })
          if(agentData.data.status === 422){
            setErrors(agentData.data.message)
          }else{
            alert(agentData.data.message)
            setOpenUserForm(false);
            location.reload();
          }
        };
      };
  
    return (
        <>
        {openUserForm && (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-auto">
           
           <div className="flex justify-between items-center pb-3 border-b">
             <h2 className="text-lg font-semibold">User Registration</h2>
             <button onClick={() => setOpenUserForm(false)} className="text-gray-500 hover:text-red-600">✖</button>
           </div>
   
           <div className="space-y-4 mt-4">
             <div className="grid grid-cols-2 gap-4">
             {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName}</p>}
               <div>
                 <label className="block text-sm font-medium">Customer Name</label>
                 <input type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                   className="w-full px-3 py-2 border rounded-lg" />
                 {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName}</p>}
               </div>
   
               <div>
                 <label className="block text-sm font-medium">Email</label>
                 <input type="email" name="email" value={formData.email} onChange={handleChange}
                   className="w-full px-3 py-2 border rounded-lg" />
                 {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
               </div>
   
               <div className="flex items-center">
                 <div className="flex-grow">
                   <label className="block text-sm font-medium">Unique User Token</label>
                   <input type="text" name="uniqueUserToken" value={formData.uniqueUserToken} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100"/>
                 </div>
                 <button type="button" onClick={refreshUserToken} className="ml-2 mt-5 px-3 py-2 text-white bg-blue-600 rounded-md">🔄</button>
               </div>
   
               <div className="flex items-center">
                 <div className="flex-grow">
                   <label className="block text-sm font-medium">Password</label>
                   <input type="text" name="password" value={formData.password} onChange={handleChange}
                     className="w-full px-3 py-2 border rounded-lg"/>
                 </div>
                 <button type="button" onClick={generatePassword} className="ml-2 mt-5 px-3 py-2 text-white bg-green-600 rounded-md">🔑</button>
               </div>
   
               <div>
                 <label className="block text-sm font-medium">Organization Name</label>
                 <input type="text" name="organization" value={formData.organization} onChange={handleChange}
                   className="w-full px-3 py-2 border rounded-lg" />
                 {errors.organization && <p className="text-red-500 text-xs">{errors.organization}</p>}
               </div>
   
               <div>
                 <label className="block text-sm font-medium">User Plan</label>
                 <select name="userPlan" value={formData.userPlan} onChange={handleChange}
                   className="w-full px-3 py-2 border rounded-lg">
                   <option value="basic" selected>Basic</option>
                   <option value="premium">Premium</option>
                   <option value="enterprise">Enterprise</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium">Domain</label>
                 <input type="text" name="domain" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                 {errors.domain && <p className="text-red-500 text-xs">{errors.domain}</p>}
               </div>
               <div>
                 <label className="block text-sm font-medium">Agents</label>
                 <select name="agent" value={formData.agent} onChange={handleChange}
                   className="w-full px-3 py-2 border rounded-lg">
                   <option value="">Select agent</option>
                  {agentData.map((agent) => (
                    <option key={agent.agent_id} value={agent.agent_id}>{agent.name}</option>
                  ))}
                 </select>
               </div>
   
             </div>
   
             <div className="flex justify-between pt-3 border-t">
               <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md" onClick={handleSubmit}>Submit</button>
               <button type="button" onClick={() => setOpenUserForm(false)} className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md">Cancel</button>
             </div>
   
           </div>
         </div>
       </div>
         )}
    </>
    );
}
