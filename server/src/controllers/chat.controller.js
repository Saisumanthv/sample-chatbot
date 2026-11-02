import { processChatMessage } from '../services/chat.service.js';
import { generateSuggestedQuestions } from '../services/gemini.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function sendMessageHandler(req, res, next) {
  try {
    const { conversationId, message, requestId } = req.body;

    const result = await processChatMessage({
      supabase: req.userSupabase,
      userId: req.user.id,
      conversationId: conversationId || null,
      message,
      requestId
    });

    return res.status(200).json({
      success: true,
      conversationId: result.conversationId,
      conversationTitle: result.conversationTitle,
      userMessage: result.userMessage,
      assistantMessage: result.assistantMessage,
      data: result,
      message: 'AI response generated successfully.'
    });
  } catch (err) {
    if (err.conversationId && err.userMessage) {
      // User message was saved, but AI generation failed
      return res.status(err.statusCode || 502).json({
        success: false,
        conversationId: err.conversationId,
        userMessage: err.userMessage,
        error: {
          code: err.code || 'AI_GENERATION_FAILED',
          message: err.message || 'AI message generation encountered an error.'
        }
      });
    }
    next(err);
  }
}

export async function getSuggestionsHandler(req, res, next) {
  try {
    const suggestions = await generateSuggestedQuestions();
    return successResponse(res, { suggestions }, 'Suggested questions retrieved successfully.');
  } catch (err) {
    next(err);
  }
}

