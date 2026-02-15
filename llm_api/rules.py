from schemas import DeclaredPreferences, BehaviorMetrics
from typing import Dict


def compute_prompt_controls(preferences: DeclaredPreferences, metrics: BehaviorMetrics) -> Dict:
    """
    Computes adaptive prompt controls based on stable preferences and volatile metrics.
    
    Args:
        preferences: User's declared preferences
        metrics: Real-time behavioral metrics
        
    Returns:
        Dictionary with prompt control parameters
    """
    # Default values - Start with more steps for better breakdown
    step_limit = 4  # Increased from 2 to 4
    max_effort = 30  # Increased from 20 to 30
    max_words = 8  # Increased from 5 to 8
    language = "simple"

    # Stable overrides based on preferences
    if preferences.reading_difficulty == "high":
        max_words = 5
        language = "very simple"
        step_limit = 3  # Still give multiple steps even with high difficulty
    elif preferences.reading_difficulty == "medium":
        max_words = 7
        step_limit = 4

    if preferences.prefers_micro_steps:
        step_limit = 2  # Changed from 1 to 2 - still micro but not single step
        max_effort = 20

    # Adaptive behavior based on metrics
    # User is struggling to start (but not severely)
    if metrics.avg_time_to_first_action_seconds > 45:
        step_limit = max(1, step_limit - 2)  # Reduce but not to 1 unless already low
        max_effort = 15
    elif metrics.avg_time_to_first_action_seconds > 30:
        step_limit = max(2, step_limit - 1)
        max_effort = 20

    # User is abandoning sessions frequently
    if metrics.session_abandon_rate > 0.7:  # Very high abandon rate
        step_limit = 1
        max_effort = 10
        max_words = 3
    elif metrics.session_abandon_rate > 0.5:  # Moderate abandon rate
        step_limit = max(2, step_limit - 1)
        max_effort = 15
        max_words = 5

    # User is taking too long per step (fatigue indicator)
    if metrics.avg_step_completion_time_seconds > 90:  # Very fatigued
        step_limit = 1
        max_effort = 10
    elif metrics.avg_step_completion_time_seconds > 60:  # Somewhat fatigued
        step_limit = max(2, step_limit - 1)
        max_effort = 20

    return {
        "step_limit": step_limit,
        "max_effort": max_effort,
        "max_words": max_words,
        "language": language
    }