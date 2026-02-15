import StableProfile from "../models/StableProfile.js";
import VolatileMetrics from "../models/VolatileMetrics.js";

/**
 * Setup user profile (onboarding)
 */
export async function setupProfile(req, res) {
  try {
    const { rigid, volatile } = req.body;
    const userId = req.user.id;

    // Update or create stable profile
    const stableProfile = await StableProfile.findOneAndUpdate(
      { userId },
      { 
        userId,
        preferences: {
          task_paralysis: rigid?.task_paralysis || 'Sometimes',
          reading_difficulty: rigid?.reading_difficulty || 'medium',
          prefers_micro_steps: rigid?.prefers_micro_steps !== 'No',
          time_blindness: rigid?.time_blindness !== 'No',
          prefers_voice: rigid?.prefers_voice === 'Yes',
          prefers_minimal_text: true,
          auto_adjust_allowed: true
        }
      },
      { upsert: true, new: true }
    );

    // Create volatile metrics snapshot
    const volatileMetrics = await VolatileMetrics.create({
      userId,
      metrics: {
        energy: volatile?.energy || 'Medium',
        anxiety: volatile?.anxiety || 'Low',
        focus: volatile?.focus || 'Medium',
        intent: volatile?.intent || 'Plan a task',
        avg_time_to_first_action_seconds: 0,
        avg_step_completion_time_seconds: 0,
        steps_completed_last_session: 0,
        steps_shown_last_session: 0,
        session_abandon_rate: 0
      }
    });

    res.json({ 
      success: true,
      message: "Profile setup complete",
      stableProfile,
      volatileMetrics
    });

  } catch (error) {
    console.error('Setup profile error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to setup profile" 
    });
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(req, res) {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const stableProfile = await StableProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          preferences: updates 
        } 
      },
      { new: true, upsert: true }
    );

    res.json({ 
      success: true,
      message: "Preferences updated",
      stableProfile
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update preferences" 
    });
  }
}

/**
 * Get user profile
 */
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const stableProfile = await StableProfile.findOne({ userId });
    const volatileMetrics = await VolatileMetrics
      .findOne({ userId })
      .sort({ createdAt: -1 });

    res.json({ 
      success: true,
      stableProfile,
      volatileMetrics
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get profile" 
    });
  }
}

/**
 * Update volatile metrics (current state)
 */
export async function updateVolatileMetrics(req, res) {
  try {
    const userId = req.user.id;
    const metrics = req.body;

    const volatileMetrics = await VolatileMetrics.create({
      userId,
      metrics
    });

    res.json({ 
      success: true,
      message: "Metrics updated",
      volatileMetrics
    });

  } catch (error) {
    console.error('Update metrics error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update metrics" 
    });
  }
}
