import StableProfile from "../models/StableProfile.js";
import VolatileMetrics from "../models/VolatileMetrics.js";

import { callCompanionAI } from "../services/aiProxy.service.js";
import { buildCompanionPayload } from "../services/aiPayloadBuilder.js";

/**
 * Companion AI response
 */
export async function respond(req, res) {
  try {
    const userId = req.user.id;
    const { current_step, message } = req.body;

    // Accept both 'current_step' and 'message'
    const userMessage = current_step || message;

    if (!userMessage) {
      return res.status(400).json({ 
        success: false,
        message: "Message is required" 
      });
    }

    // Get user profiles
    const stable = await StableProfile.findOne({ userId });
    const volatile = await VolatileMetrics
      .findOne({ userId })
      .sort({ createdAt: -1 });

    // Build AI payload
    const payload = buildCompanionPayload(
      userMessage,
      stable?.preferences,
      volatile?.metrics
    );

    let response;

    // Try to call AI service if configured
    if (process.env.AI_BASE_URL) {
      try {
        const aiResponse = await callCompanionAI(payload);
        response = aiResponse.response || aiResponse.reply || generateFallbackResponse(userMessage);
      } catch (aiError) {
        console.warn('AI service unavailable, using fallback:', aiError.message);
        response = generateFallbackResponse(userMessage);
      }
    } else {
      // Use fallback if no AI service configured
      response = generateFallbackResponse(userMessage);
    }

    res.json({ 
      success: true,
      response,
      reply: response // Support both field names
    });

  } catch (error) {
    console.error('Companion respond error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate response",
      error: error.message
    });
  }
}

/**
 * Fallback responses when AI is unavailable
 */
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Empathetic responses based on keywords
  if (lowerMessage.includes('stuck') || lowerMessage.includes('can\'t')) {
    return "I hear you. Feeling stuck is completely normal. What if we broke this down into just one tiny step you could take right now?";
  }
  
  if (lowerMessage.includes('overwhelm') || lowerMessage.includes('too much')) {
    return "It sounds like there's a lot going on. You don't have to tackle everything at once. What feels most important to address first?";
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return "I understand. Anxiety can make everything feel harder. Let's take this slowly. Would it help to talk through what's worrying you?";
  }
  
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    return "It's okay to be tired. Rest is part of the process. Maybe we can find a gentler way forward that honors your energy right now.";
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
    return "You're very welcome. I'm here whenever you need support.";
  }
  
  // Default empathetic response
  return "I'm here with you. Tell me more about what's on your mind, and we'll work through it together at your pace.";
}
