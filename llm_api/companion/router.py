from fastapi import APIRouter, HTTPException
from schemas import CompanionRequest, CompanionResponse
from companion.service import get_companion_response

router = APIRouter(prefix="/companion", tags=["Companion"])


@router.post("/respond", response_model=CompanionResponse)
def respond(req: CompanionRequest):
    """
    Provides a supportive companion response based on current user state.
    
    Args:
        req: CompanionRequest with current step, profile, and metrics
        
    Returns:
        CompanionResponse with supportive message
    """
    try:
        response = get_companion_response(
            step=req.current_step,
            metrics=req.metrics,
            stable_profile=req.stable_profile
        )
        return CompanionResponse(response=response)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating companion response: {str(e)}"
        )
