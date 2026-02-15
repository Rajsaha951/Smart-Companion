import StableProfile from "../models/StableProfile.js";
import VolatileMetrics from "../models/VolatileMetrics.js";
import TaskSession from "../models/TaskSession.js";

import { callPlannerAI } from "../services/aiProxy.service.js";
import { buildPlannerPayload } from "../services/aiPayloadBuilder.js";

/**
 * Decompose task into micro-steps
 */
export async function decompose(req, res) {
  try {
    const userId = req.user.id;
    const { task } = req.body;

    // Validation
    if (!task || (!task.task_text && typeof task !== 'string')) {
      return res.status(400).json({ 
        success: false,
        message: "Task is required" 
      });
    }

    // Get user profiles
    const stable = await StableProfile.findOne({ userId });
    const volatile = await VolatileMetrics
      .findOne({ userId })
      .sort({ createdAt: -1 });

    // Build AI payload
    const payload = buildPlannerPayload(
      task,
      stable?.preferences,
      volatile?.metrics
    );

    let steps;
    let aiResponse;

    // Try to call AI service if configured
    if (process.env.AI_BASE_URL) {
      try {
        aiResponse = await callPlannerAI(payload);
        steps = aiResponse.steps || [];
      } catch (aiError) {
        console.warn('AI service unavailable, using fallback:', aiError.message);
        steps = generateFallbackSteps(task);
      }
    } else {
      // Use fallback if no AI service configured
      steps = generateFallbackSteps(task);
    }

    // Save task session
    const taskSession = await TaskSession.create({
      userId,
      taskText: typeof task === 'string' ? task : task.task_text,
      steps
    });

    res.json({ 
      success: true,
      steps,
      sessionId: taskSession._id,
      message: "Task decomposed successfully"
    });

  } catch (error) {
    console.error('Decompose error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to decompose task",
      error: error.message
    });
  }
}

/**
 * Get task sessions for user
 */
export async function getTaskSessions(req, res) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const sessions = await TaskSession
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ 
      success: true,
      sessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get task sessions" 
    });
  }
}

/**
 * Update task session progress
 */
export async function updateProgress(req, res) {
  try {
    const { sessionId } = req.params;
    const { currentStepIndex, completed } = req.body;
    const userId = req.user.id;

    const session = await TaskSession.findOneAndUpdate(
      { _id: sessionId, userId },
      { 
        currentStepIndex,
        completed,
        ...(completed && { completedAt: new Date() })
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ 
        success: false,
        message: "Task session not found" 
      });
    }

    res.json({ 
      success: true,
      session
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update progress" 
    });
  }
}

/**
 * Fallback step generator when AI is unavailable
 */
function generateFallbackSteps(task) {
  const taskText = typeof task === 'string' ? task : task.task_text;
  
  // Simple rule-based step generation
  const steps = [
    `Gather everything you need for: "${taskText}"`,
    `Set up your space`,
    `Start the first small part of the task`,
    `Take a short break if needed`,
    `Continue with the next part`,
    `Review what you've done`,
    `Finish up and put things away`
  ];

  // Adjust based on task length
  if (taskText.length < 20) {
    return steps.slice(0, 3);
  } else if (taskText.length < 50) {
    return steps.slice(0, 5);
  }
  
  return steps;
}
