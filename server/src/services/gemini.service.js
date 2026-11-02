import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';

let genAIInstance = null;

function getGenAIClient() {
  if (!config.gemini.apiKey || config.gemini.apiKey === 'your-gemini-api-key') {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey: config.gemini.apiKey
    });
  }
  return genAIInstance;
}

/**
 * Generate chat response from Gemini using conversation history
 * @param {Array<{role: string, content: string}>} history - Previous messages
 * @param {string} currentMessage - The current user message
 * @returns {Promise<string>} Generated response text
 */
export async function generateChatResponse(history, currentMessage) {
  const ai = getGenAIClient();
  if (!ai) {
    const error = new Error('Google Gemini API key is not configured on the backend server. Please set GEMINI_API_KEY in server/.env.');
    error.statusCode = 503;
    error.code = 'GEMINI_KEY_MISSING';
    error.isPublic = true;
    throw error;
  }

  // Format historical messages into Gemini format
  // Maps 'assistant' -> 'model', 'user' -> 'user'
  const contents = [];

  // Truncate history to configured maximum context turns
  const maxContext = config.limits.maxContextMessages;
  const slicedHistory = history.length > maxContext ? history.slice(-maxContext) : history;

  for (const msg of slicedHistory) {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    contents.push({
      role,
      parts: [{ text: msg.content }]
    });
  }

  // Append current user message
  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }]
  });

  try {
    const response = await ai.models.generateContent({
      model: config.gemini.model,
      contents,
      config: {
        systemInstruction: config.gemini.systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 4096
      }
    });

    const text = response?.text?.trim();

    if (!text) {
      const error = new Error('Gemini API returned an empty response.');
      error.statusCode = 502;
      error.code = 'EMPTY_AI_RESPONSE';
      error.isPublic = true;
      throw error;
    }

    return text;
  } catch (err) {
    console.error('[Gemini Service] generateChatResponse error:', err.message);

    // If it's already an error with isPublic, rethrow
    if (err.isPublic) throw err;

    // Distinguish quota, rate limit, invalid key, or network
    const messageLower = err.message.toLowerCase();
    const error = new Error();

    if (messageLower.includes('api_key') || messageLower.includes('unauthorized') || messageLower.includes('api key')) {
      error.message = 'The configured Gemini API key is invalid or unauthorized.';
      error.statusCode = 502;
      error.code = 'INVALID_GEMINI_KEY';
      error.isPublic = true;
    } else if (messageLower.includes('quota') || messageLower.includes('rate') || messageLower.includes('429')) {
      error.message = 'Gemini API rate limit or quota exceeded. Please wait a moment before trying again.';
      error.statusCode = 429;
      error.code = 'GEMINI_QUOTA_EXCEEDED';
      error.isPublic = true;
    } else {
      error.message = 'Failed to generate response from Gemini AI. ' + (err.message || 'Please try again later.');
      error.statusCode = 502;
      error.code = 'GEMINI_API_ERROR';
      error.isPublic = true;
    }

    throw error;
  }
}

/**
 * Generate a concise title for a conversation based on initial user message
 * Uses structured JSON output with deterministic fallback
 * @param {string} initialMessage
 * @returns {Promise<string>} Generated conversation title
 */
export async function generateConversationTitle(initialMessage) {
  // Deterministic fallback function
  const fallbackTitle = () => {
    const words = initialMessage
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 6);
    if (!words.length || !words[0]) return 'New Chat';
    const joined = words.join(' ');
    return joined.charAt(0).toUpperCase() + joined.slice(1);
  };

  const ai = getGenAIClient();
  if (!ai) {
    return fallbackTitle();
  }

  try {
    const response = await ai.models.generateContent({
      model: config.gemini.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a concise, descriptive title (3 to 6 words) for a chat conversation that begins with this user message. Do not use quotes or punctuation. Return valid JSON only.

User message: "${initialMessage.slice(0, 300)}"`
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' }
          },
          required: ['title']
        },
        temperature: 0.4,
        maxOutputTokens: 50
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.title && typeof parsed.title === 'string' && parsed.title.trim().length > 0) {
      return parsed.title.trim().slice(0, 80);
    }
    return fallbackTitle();
  } catch (err) {
    console.warn('[Gemini Service] Title generation fallback used:', err.message);
    return fallbackTitle();
  }
}

/**
 * Generate suggested questions for welcome screen
 * Uses structured JSON output with fallback
 * @returns {Promise<string[]>}
 */
export async function generateSuggestedQuestions() {
  const fallbackSuggestions = [
    'Explain artificial intelligence in simple terms.',
    'Help me understand JavaScript and modern web development.',
    'What are some effective techniques for learning new skills?',
    'Explain how web applications communicate with APIs.',
    'Help me brainstorm a creative full-stack project idea.'
  ];

  const ai = getGenAIClient();
  if (!ai) {
    return fallbackSuggestions;
  }

  try {
    const response = await ai.models.generateContent({
      model: config.gemini.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Generate 4 diverse, engaging, and clear questions that a user might ask a general-purpose AI assistant. Return valid JSON only with a "suggestions" array.'
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            suggestions: {
              type: 'ARRAY',
              items: { type: 'STRING' }
            }
          },
          required: ['suggestions']
        },
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (Array.isArray(parsed.suggestions) && parsed.suggestions.length >= 3) {
      return parsed.suggestions.slice(0, 5);
    }
    return fallbackSuggestions;
  } catch (err) {
    console.warn('[Gemini Service] Suggestion generation fallback used:', err.message);
    return fallbackSuggestions;
  }
}

