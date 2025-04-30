import mongoose from "mongoose";

const ProspectSchema = new mongoose.Schema(
  {
    agent_id: { type: String, required: true },
    prospect_name: { type: String, required: true },
    prospect_email: { type: String, required: true, unique: true },
    prospect_location: { type: String, required: false },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: true },
    status: { type: String, enum: ["active", "deactivated"], required: false },
    password: { type: String, required: false }
  },
  { timestamps: true }
);

export default mongoose.models.Prospects || mongoose.model("Prospects", ProspectSchema);
