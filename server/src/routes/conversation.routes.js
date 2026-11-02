import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createConversationSchema,
  renameConversationSchema,
  conversationIdParamSchema
} from '../validators/conversation.validator.js';
import {
  createConversationHandler,
  getConversationsHandler,
  getConversationByIdHandler,
  renameConversationHandler,
  deleteConversationHandler,
  getConversationMessagesHandler
} from '../controllers/conversation.controller.js';

const router = Router();

// All conversation routes require authentication
router.use(requireAuth);

router.post(
  '/',
  validate(createConversationSchema, 'body'),
  asyncHandler(createConversationHandler)
);

router.get(
  '/',
  asyncHandler(getConversationsHandler)
);

router.get(
  '/:conversationId',
  validate(conversationIdParamSchema, 'params'),
  asyncHandler(getConversationByIdHandler)
);

router.patch(
  '/:conversationId',
  validate(conversationIdParamSchema, 'params'),
  validate(renameConversationSchema, 'body'),
  asyncHandler(renameConversationHandler)
);

router.delete(
  '/:conversationId',
  validate(conversationIdParamSchema, 'params'),
  asyncHandler(deleteConversationHandler)
);

router.get(
  '/:conversationId/messages',
  validate(conversationIdParamSchema, 'params'),
  asyncHandler(getConversationMessagesHandler)
);

export default router;

