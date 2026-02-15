from typing import Dict


def build_prompt(task_text: str, controls: Dict) -> str:
    """
    Builds a prompt for the LLM to decompose tasks into micro-steps.
    
    Args:
        task_text: The task to decompose
        controls: Dictionary with prompt control parameters
        
    Returns:
        Formatted prompt string
    """
    return f"""You are an assistive AI that breaks tasks into MICRO-ACTIONS for neurodivergent users.

STRICT RULES (MANDATORY):
1. Output ONLY valid JSON - no other text
2. One concrete, physical or mental action per step
3. Maximum {controls['step_limit']} step(s) in this response
4. Each step must take LESS than {controls['max_effort']} seconds to complete
5. Maximum {controls['max_words']} words per step
6. Use {controls['language']} language
7. NO advice, NO motivation, NO explanations - just actions
8. Start each step with an action verb
9. Be extremely specific and concrete

TASK TO DECOMPOSE:
"{task_text}"

REQUIRED OUTPUT FORMAT (JSON only):
{{
  "steps": ["First micro-action", "Second micro-action"],
  "estimated_time_minutes": <total time for all steps>,
  "more_steps_available": <true if task needs more steps after these>
}}

Remember: Output ONLY the JSON object, nothing else."""
