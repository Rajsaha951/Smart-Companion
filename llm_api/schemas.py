from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class DeclaredPreferences(BaseModel):
    """User's declared preferences for task decomposition"""
    reading_difficulty: str = Field(default="medium", description="Reading difficulty level: low, medium, high")
    prefers_micro_steps: bool = Field(default=True, description="Prefer very small steps")
    time_blindness: bool = Field(default=True, description="User has difficulty estimating time")
    prefers_minimal_text: bool = Field(default=True, description="Prefer concise instructions")
    auto_adjust_allowed: bool = Field(default=True, description="Allow automatic adjustments based on behavior")


class BehaviorMetrics(BaseModel):
    """Real-time behavioral metrics"""
    avg_time_to_first_action_seconds: float = Field(ge=0, description="Average time before starting a step")
    avg_step_completion_time_seconds: float = Field(ge=0, description="Average time to complete a step")
    steps_completed_last_session: int = Field(ge=0, description="Number of steps completed in last session")
    steps_shown_last_session: int = Field(ge=0, description="Number of steps shown in last session")
    session_abandon_rate: float = Field(ge=0, le=1, description="Rate of abandoned sessions (0-1)")


class TaskContext(BaseModel):
    """Information about the current task"""
    task_text: str = Field(min_length=1, description="The task to be decomposed")
    current_step_index: int = Field(default=0, ge=0, description="Index of current step")
    steps_completed: int = Field(default=0, ge=0, description="Total steps completed so far")


class DecomposeRequest(BaseModel):
    """Request to decompose a task"""
    preferences: DeclaredPreferences
    metrics: BehaviorMetrics
    task: TaskContext


class DecomposeResponse(BaseModel):
    """Response containing decomposed steps"""
    steps: List[str] = Field(min_items=1, description="List of micro-steps")
    estimated_time_minutes: float = Field(ge=0, description="Estimated time to complete all steps (can be fractional)")
    more_steps_available: bool = Field(description="Whether more steps are available")


# Companion Service Schemas
class CompanionRequest(BaseModel):
    """Request for companion support"""
    current_step: str = Field(min_length=1, description="The current step user is on")
    stable_profile: Dict = Field(description="User's stable accessibility profile")
    metrics: Dict = Field(description="Current behavioral metrics")


class CompanionResponse(BaseModel):
    """Companion support response"""
    response: str = Field(description="Supportive message for the user")