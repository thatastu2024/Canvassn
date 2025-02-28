import mongoose from "mongoose";

const ConversationsSchema = new mongoose.Schema(
  {
    agent_id: { type: String, required: true },
    agent_name: { type: String, required: false },
    conversation_id: { type: String, required: true, unique: true },
    start_time_unix_secs: { type: Number, required: false },
    call_duration_secs: { type: Number, required: false },
    message_count: { type: Number, required: false },
    status: { type: String, enum: ["pending", "done", "failed"], required: false },
    call_successful: { type: String, enum: ["success", "failed"], required: false }
  },
  { timestamps: true }
);

export default mongoose.models.Conversations || mongoose.model("Conversations", ConversationsSchema);
