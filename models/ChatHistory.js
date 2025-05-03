import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema(
  {
    user_unique_id: { type: String, required: true },
    session_id: { type: String, required: true, unique: true },
    start_time_unix_secs: { type: Number, required: false },
    call_duration_secs: { type: Number, required: false },
    status: { type: String, enum: ["processing", "done", "failed"], required: false },
    transcript: { type: mongoose.Schema.Types.Mixed, required: false },
    metadata: { type: mongoose.Schema.Types.Mixed, required: false },
    analysis: { type: mongoose.Schema.Types.Mixed, required: false },
    prospect_id:{
      type: mongoose.Schema.Types.ObjectId, ref: "Prospects", required: false
    },
    total_message_exchange:{ type:String, required:false},
    agent_id: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.ChatHistory || mongoose.model("ChatHistory", ChatHistorySchema);
