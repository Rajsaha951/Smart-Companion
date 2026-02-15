from typing import Dict


def build_companion_prompt(step: str, stable: Dict, volatile: Dict) -> str:
    """
    Builds a prompt for the companion LLM to provide supportive messages.
    
    Args:
        step: The current step the user is working on
        stable: User's stable accessibility profile
        volatile: User's current inferred state
        
    Returns:
        Formatted prompt for the companion LLM
    """
    return f"""You are an optimistic task companion providing supportive tips.

USER STATE:
- Stable profile: {stable}
- Current state: {volatile}

TASK STEP: "{step}"

INSTRUCTIONS:
Generate 1-4 specific, actionable, encouraging tips for this step.
Each tip should be 8-15 words.
Be optimistic and practical.
Do NOT use generic phrases like "here are some tips" or "you can do it".
Give SPECIFIC encouragement or advice related to the step.

Output ONLY the bullet points, nothing else.
Start each line with •

Example output format:
• Take a deep breath before starting - it helps you focus
• This step usually takes less than a minute to complete
• You've done harder things today, this one is manageable

Now provide 1-4 bullet points for the current step:"""