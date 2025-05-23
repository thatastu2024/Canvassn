import mongoose from "mongoose";

const UserDetailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: true },
    agentId: { type: String, required: true },
    domainName: { type: String, required: true },
    status: { type: String, enum: ["active","inactive"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.UserDetail || mongoose.model("UserDetail", UserDetailSchema);
