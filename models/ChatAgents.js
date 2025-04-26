import mongoose from "mongoose";

const ChatAgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    conversation_config: { type: mongoose.Schema.Types.Mixed, required: false },
    platform_settings: { type: mongoose.Schema.Types.Mixed, required: false },
    secrets: { type: mongoose.Schema.Types.Mixed, required: false },
    agent_id: { type: String, required: false },
    avatar: { type: String, required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: false },
    agent_type: { type: String, enum: ["voice","chat"], required: true }
  },
  { timestamps: true }
);

export default mongoose.models.ChatAgent || mongoose.model("ChatAgent", ChatAgentSchema);
