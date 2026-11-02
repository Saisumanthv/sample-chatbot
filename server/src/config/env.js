import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    systemPrompt: process.env.CHATBOT_SYSTEM_PROMPT || 'You are a helpful, intelligent, friendly, and knowledgeable AI assistant.',
    timeout: parseInt(process.env.AI_REQUEST_TIMEOUT || '60000', 10),
  },

  limits: {
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '10000', 10),
    maxContextMessages: parseInt(process.env.MAX_CONTEXT_MESSAGES || '30', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  }
};

