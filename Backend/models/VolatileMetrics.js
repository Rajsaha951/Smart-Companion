import mongoose from "mongoose";

const volatileMetricsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metrics: {
    energy: { type: String, default: 'Medium' },
    anxiety: { type: String, default: 'Low' },
    focus: { type: String, default: 'Medium' },
    intent: { type: String, default: 'Plan a task' },
    avg_time_to_first_action_seconds: { type: Number, default: 0 },
    avg_step_completion_time_seconds: { type: Number, default: 0 },
    steps_completed_last_session: { type: Number, default: 0 },
    steps_shown_last_session: { type: Number, default: 0 },
    session_abandon_rate: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

// Index for faster queries
volatileMetricsSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("VolatileMetrics", volatileMetricsSchema);
