import mongoose from "mongoose";

const taskSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskText: {
    type: String,
    required: true
  },
  steps: [{
    type: String
  }],
  currentStepIndex: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSessionSchema.index({ userId: 1, createdAt: -1 });
taskSessionSchema.index({ userId: 1, completed: 1 });

export default mongoose.model("TaskSession", taskSessionSchema);
