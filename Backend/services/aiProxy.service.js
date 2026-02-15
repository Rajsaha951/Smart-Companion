import axios from "axios";

/**
 * Call Planner AI service
 */
export async function callPlannerAI(payload) {
  const AI_BASE_URL = process.env.AI_BASE_URL;

  if (!AI_BASE_URL) {
    throw new Error("AI_BASE_URL is not configured in environment variables");
  }

  try {
    const response = await axios.post(
      `${AI_BASE_URL}/decompose`,
      payload,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error('Planner AI error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('AI service is unavailable');
    }
    
    if (error.response) {
      throw new Error(`AI service error: ${error.response.status}`);
    }
    
    throw error;
  }
}

/**
 * Call Companion AI service
 */
export async function callCompanionAI(payload) {
  const AI_BASE_URL = process.env.AI_BASE_URL;

  if (!AI_BASE_URL) {
    throw new Error("AI_BASE_URL is not configured in environment variables");
  }

  try {
    const response = await axios.post(
      `${AI_BASE_URL}/companion/respond`,
      payload,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error('Companion AI error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('AI service is unavailable');
    }
    
    if (error.response) {
      throw new Error(`AI service error: ${error.response.status}`);
    }
    
    throw error;
  }
}
