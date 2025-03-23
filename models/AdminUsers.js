import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    user_unique_token: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    user_type: { type: String, enum: ["superadmin","admin", "employee"], required: true },
    organization_name: { type: String, required: false},
    planId: {type: String, required: false}
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
