import mongoose from "mongoose";

const ChatAgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    conversation_config: { type: mongoose.Schema.Types.Mixed, required: true },
    platform_settings: { type: mongoose.Schema.Types.Mixed, required: true },
    secrets: { type: mongoose.Schema.Types.Mixed, required: true },
    agent_id: { type: String, required: true },
    avatar: { type: String, required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.ChatAgent || mongoose.model("ChatAgent", ChatAgentSchema);
