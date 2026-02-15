from typing import Dict


def default_stable_profile() -> Dict:
    """
    Returns the default stable accessibility profile for neurodivergent users.
    This profile should remain constant across sessions.
    
    Returns:
        Dictionary with stable user preferences
    """
    return {
        "adhd_safe": True,
        "dyslexia_safe": True,
        "tone": "reassuring",
        "max_sentence_length": 8,
        "needs_extra_breakdown": True,
        "no_pressure_language": True
    }
