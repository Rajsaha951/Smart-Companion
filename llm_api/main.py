from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, HTTPException
from schemas import DecomposeRequest, DecomposeResponse
from rules import compute_prompt_controls
from prompt_builder import build_prompt
from companion.router import router as companion_router

from google import genai
from google.genai import types
import json

# Verify API key is loaded
if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please check your .env file.")

app = FastAPI(title="Task Decomposition Service")

# Include companion router
app.include_router(companion_router)

# Configure Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.post("/decompose", response_model=DecomposeResponse)
def decompose_task(req: DecomposeRequest):
    """
    Decomposes a task into micro-steps based on user preferences and metrics.
    """
    try:
        # Compute adaptive controls
        controls = compute_prompt_controls(req.preferences, req.metrics)

        # Build prompt for LLM
        prompt = build_prompt(req.task.task_text, controls)

        # Try multiple models until one works
        models_to_try = [
            'gemini-2.5-flash-lite',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-flash-latest',
        ]
        
        response = None
        last_error = None
        
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2,
                        response_mime_type="application/json"
                    )
                )
                print(f"✓ Decompose using model: {model_name}")
                break
            except Exception as e:
                print(f"✗ Model {model_name} failed: {e}")
                last_error = e
                continue
        
        if not response:
            raise Exception(f"All models failed. Last error: {last_error}")

        # Parse JSON response
        output = json.loads(response.text)
        
        # Validate output structure
        if not all(key in output for key in ["steps", "estimated_time_minutes", "more_steps_available"]):
            raise ValueError("Invalid response structure from LLM")

        return DecomposeResponse(
            steps=output["steps"],
            estimated_time_minutes=output["estimated_time_minutes"],
            more_steps_available=output["more_steps_available"]
        )

    except json.JSONDecodeError:
        # Fallback response
        return DecomposeResponse(
            steps=["Take one small action"],
            estimated_time_minutes=1,
            more_steps_available=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}