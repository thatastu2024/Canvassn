import mongoose from "mongoose";

const ConversationsSchema = new mongoose.Schema(
  {
    agent_id: { type: String, required: true },
    agent_name: { type: String, required: false },
    conversation_id: { type: String, required: true, unique: true },
    start_time_unix_secs: { type: Number, required: false },
    call_duration_secs: { type: Number, required: false },
    status: { type: String, enum: ["processing", "done", "failed"], required: false },
    call_successful: { type: String, enum: ["success", "failed"], required: false },
    transcript: { type: mongoose.Schema.Types.Mixed, required: false },
    metadata: { type: mongoose.Schema.Types.Mixed, required: false },
    analysis: { type: mongoose.Schema.Types.Mixed, required: false },
    conversation_initiation_client_data: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Conversations || mongoose.model("Conversations", ConversationsSchema);
