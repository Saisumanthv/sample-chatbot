import {
  createConversation,
  getUserConversations,
  getConversationById,
  renameConversation,
  deleteConversation
} from '../services/conversation.service.js';
import { getConversationMessages } from '../services/chat.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function createConversationHandler(req, res) {
  const { title } = req.body;
  const conversation = await createConversation(req.userSupabase, req.user.id, title);
  return successResponse(res, { conversation }, 'Conversation created successfully.', 201);
}

export async function getConversationsHandler(req, res) {
  const conversations = await getUserConversations(req.userSupabase, req.user.id);
  return successResponse(res, { conversations }, 'Conversations retrieved successfully.');
}

export async function getConversationByIdHandler(req, res) {
  const { conversationId } = req.params;
  const conversation = await getConversationById(req.userSupabase, conversationId, req.user.id);
  return successResponse(res, { conversation }, 'Conversation retrieved successfully.');
}

export async function renameConversationHandler(req, res) {
  const { conversationId } = req.params;
  const { title } = req.body;
  const conversation = await renameConversation(req.userSupabase, conversationId, req.user.id, title);
  return successResponse(res, { conversation }, 'Conversation renamed successfully.');
}

export async function deleteConversationHandler(req, res) {
  const { conversationId } = req.params;
  await deleteConversation(req.userSupabase, conversationId, req.user.id);
  return successResponse(res, { deleted: true, conversationId }, 'Conversation deleted successfully.');
}

export async function getConversationMessagesHandler(req, res) {
  const { conversationId } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
  const messages = await getConversationMessages(req.userSupabase, conversationId, req.user.id, limit);
  return successResponse(res, { messages }, 'Messages retrieved successfully.');
}

