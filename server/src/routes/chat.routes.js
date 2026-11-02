import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { chatLimiter } from '../middleware/rateLimit.middleware.js';
import { chatSchema } from '../validators/chat.validator.js';
import { sendMessageHandler, getSuggestionsHandler } from '../controllers/chat.controller.js';

const router = Router();

// Route for suggestions (available for authenticated users)
router.get('/suggestions', requireAuth, getSuggestionsHandler);

// Route for sending a chat message
router.post(
  '/',
  requireAuth,
  chatLimiter,
  validate(chatSchema, 'body'),
  sendMessageHandler
);

export default router;

