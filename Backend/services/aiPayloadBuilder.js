const DEFAULT_PREFERENCES = {
  reading_difficulty: "medium",
  prefers_micro_steps: true,
  time_blindness: true,
  prefers_minimal_text: true,
  auto_adjust_allowed: true
};

const DEFAULT_METRICS = {
  avg_time_to_first_action_seconds: 0,
  avg_step_completion_time_seconds: 0,
  steps_completed_last_session: 0,
  steps_shown_last_session: 0,
  session_abandon_rate: 0
};

export function buildPlannerPayload(
  task,
  stableProfile,
  volatileMetrics
) {
  // Normalize task: accept either a string or an object
  const normalizedTask =
    typeof task === "string"
      ? { task_text: task }
      : task || { task_text: "" };

  return {
    task: normalizedTask,
    preferences: { ...DEFAULT_PREFERENCES, ...(stableProfile || {}) },
    metrics: { ...DEFAULT_METRICS, ...(volatileMetrics || {}) }
  };
}

export function buildCompanionPayload(
  currentStep,
  stableProfile,
  volatileMetrics
) {
  return {
    current_step: currentStep,
    stable_profile: { ...DEFAULT_PREFERENCES, ...(stableProfile || {}) },
    metrics: { ...DEFAULT_METRICS, ...(volatileMetrics || {}) }
  };
}
