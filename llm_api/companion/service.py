"""
Service layer for companion functionality.
Coordinates between state inference, prompt building, and LLM calls.
"""
from dotenv import load_dotenv
import os
import json
import re

# Load environment variables
load_dotenv()

from typing import Dict, List
from .state import infer_volatile_state
from google import genai
from google.genai import types


# Verify API key is loaded
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found. Please check your .env file.")

# Configure Gemini for companion responses
client = genai.Client(api_key=api_key)

# Track which models are quota-exhausted (in-memory for session)
QUOTA_EXHAUSTED_MODELS = set()


def build_simple_prompt(step: str, stable: Dict, volatile: Dict) -> str:
    """Build a simpler prompt that's easier for the model to follow."""
    return f"""Generate 2-4 short, encouraging tips for this task step.

Step: "{step}"

User state: {volatile}

Rules:
- Each tip should be 8-15 words
- Be specific and actionable
- Be optimistic and supportive
- Output ONLY a simple list, one tip per line
- Start each line with a dash (-)

Example:
- Prepare 2-3 key points beforehand to feel confident
- Take a deep breath before starting
- You belong there and have valuable input

Now generate tips for the step above:"""


def parse_tips_from_text(text: str) -> list:
    """Extract tips from text, handling various formats."""
    if not text:
        return []
    
    # Try to parse as JSON first
    try:
        # Clean markdown
        cleaned = re.sub(r'```json|```', '', text).strip()
        cleaned = re.sub(r'^.*?(\{)', r'\1', cleaned, flags=re.DOTALL)
        
        data = json.loads(cleaned)
        if isinstance(data, dict) and 'tips' in data:
            return data['tips']
    except:
        pass
    
    # Parse as line-by-line list
    tips = []
    for line in text.split('\n'):
        line = line.strip()
        # Match lines starting with -, •, *, or numbers
        if line.startswith('-') or line.startswith('•') or line.startswith('*'):
            tip = line[1:].strip()
            if tip and len(tip) > 5:  # Skip very short lines
                tips.append(tip)
        elif re.match(r'^\d+\.', line):  # Numbered lists
            tip = re.sub(r'^\d+\.\s*', '', line).strip()
            if tip and len(tip) > 5:
                tips.append(tip)
    
    return tips[:4]  # Max 4 tips


def get_smart_model_order() -> List[str]:
    """
    Returns models in smart order:
    1. Models with quota available (not in QUOTA_EXHAUSTED_MODELS)
    2. Models that might be quota-exhausted (will skip after first 429)
    """
    all_models = [
        'gemini-2.5-flash',          # Best model, usually has quota
        'gemini-flash-latest',       # Good fallback
        'gemini-2.5-flash-lite',     # Fast but limited quota
        'gemini-2.0-flash',          # Older, might have no quota
    ]
    
    # Separate into available and exhausted
    available = [m for m in all_models if m not in QUOTA_EXHAUSTED_MODELS]
    exhausted = [m for m in all_models if m in QUOTA_EXHAUSTED_MODELS]
    
    # Try available models first, then exhausted (in case quota reset)
    return available + exhausted


def call_llm(prompt: str) -> str:
    """
    Calls the LLM with the given prompt.
    Intelligently skips quota-exhausted models.
    
    Args:
        prompt: The prompt to send to the LLM
        
    Returns:
        The LLM's response as a string
    """
    models_to_try = get_smart_model_order()
    
    print(f"Model order: {models_to_try}")
    if QUOTA_EXHAUSTED_MODELS:
        print(f"Known quota-exhausted: {QUOTA_EXHAUSTED_MODELS}")
    
    last_error = None
    
    for model_name in models_to_try:
        # Skip if we know it's quota-exhausted (unless it's the last option)
        if model_name in QUOTA_EXHAUSTED_MODELS and models_to_try.index(model_name) < len(models_to_try) - 1:
            print(f"⏭️  Skipping {model_name} (quota exhausted)")
            continue
        
        try:
            print(f"Trying model: {model_name}")
            
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=500,
                )
            )
            
            if not response or not response.text:
                print(f"✗ Model {model_name} returned empty response")
                continue
            
            print(f"✓ Model {model_name} succeeded!")
            full_response = response.text.strip()
            print(f"Full response ({len(full_response)} chars):\n{full_response[:200]}...\n")
            
            # Parse tips from response
            tips = parse_tips_from_text(full_response)
            
            if tips:
                formatted = "\n".join([f"• {tip}" for tip in tips])
                print(f"Formatted response:\n{formatted}\n")
                return formatted
            else:
                print("No tips found in response, trying next model")
                continue
            
        except Exception as e:
            error_str = str(e)
            
            # Check if it's a quota error
            if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str or 'quota' in error_str.lower():
                print(f"⚠️  Model {model_name} quota exhausted - marking for future skips")
                QUOTA_EXHAUSTED_MODELS.add(model_name)
                last_error = f"Quota exhausted for {model_name}"
            else:
                print(f"✗ Model {model_name} failed: {error_str[:100]}")
                last_error = e
            
            continue
    
    # If all models fail, return fallback
    print(f"All LLM models failed. Last error: {last_error}")
    return "• You're doing great!\n• Take it one small step at a time.\n• This step is totally manageable."


def get_companion_response(step: str, stable_profile: Dict, metrics: Dict) -> str:
    """
    Generates a supportive companion response based on user state.
    
    Args:
        step: Current step the user is working on
        stable_profile: User's stable accessibility profile
        metrics: Current behavioral metrics
        
    Returns:
        Supportive message from the companion
    """
    print(f"\n=== Companion Request ===")
    print(f"Step: {step}")
    print(f"Metrics: {metrics}")
    
    # Infer user's current volatile state
    volatile_state = infer_volatile_state(metrics)
    print(f"Volatile state: {volatile_state}")

    # Build simple prompt
    prompt = build_simple_prompt(step, stable_profile, volatile_state)

    # Get response from LLM
    response = call_llm(prompt)
    print(f"Final response:\n{response}\n")
    return response