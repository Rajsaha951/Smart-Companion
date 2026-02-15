import mongoose from "mongoose";

const stableProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    task_paralysis: { type: String, default: 'Sometimes' },
    reading_difficulty: { type: String, default: 'medium' },
    prefers_micro_steps: { type: Boolean, default: true },
    time_blindness: { type: Boolean, default: true },
    prefers_voice: { type: Boolean, default: false },
    prefers_minimal_text: { type: Boolean, default: true },
    auto_adjust_allowed: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for faster queries
stableProfileSchema.index({ userId: 1 });

export default mongoose.model("StableProfile", stableProfileSchema);
