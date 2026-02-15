"""
Infers the volatile state of the user from live behavior metrics.
This represents short-term, moment-to-moment context that changes frequently.
"""
from typing import Dict


def infer_volatile_state(metrics: Dict) -> Dict:
    """
    Analyzes user metrics to determine their current emotional/cognitive state.
    
    Args:
        metrics: Dictionary containing behavioral metrics
        
    Returns:
        Dictionary with inferred state flags
    """
    state = {
        "stuck": False,
        "fatigued": False,
        "avoidance": False,
        "needs_reassurance": False,
        "stable": False
    }

    # User is stuck on current step (taking too long to start)
    if metrics.get("avg_time_to_first_action_seconds", 0) > 45:
        state["stuck"] = True
        state["needs_reassurance"] = True

    # User frequently abandons sessions (avoidance behavior)
    if metrics.get("session_abandon_rate", 0) > 0.5:
        state["avoidance"] = True
        state["needs_reassurance"] = True

    # User has been working on steps for too long (cognitive fatigue)
    if metrics.get("avg_step_completion_time_seconds", 0) > 60:
        state["fatigued"] = True

    # If no concerning patterns detected, user is in stable state
    if not any([state["stuck"], state["fatigued"], state["avoidance"]]):
        state["stable"] = True

    return state
