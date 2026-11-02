import {
  createConversation,
  getConversationById,
  touchConversation
} from './conversation.service.js';
import {
  generateChatResponse,
  generateConversationTitle
} from './gemini.service.js';

/**
 * Retrieve messages for a conversation ensuring ownership
 */
export async function getConversationMessages(supabase, conversationId, userId, limit = 100) {
  // Verify ownership
  await getConversationById(supabase, conversationId, userId);

  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, user_id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to retrieve messages: ${error.message}`);
  }

  return data || [];
}

/**
 * Save an individual message to database
 */
export async function saveMessage(supabase, conversationId, userId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        user_id: userId,
        role,
        content
      }
    ])
    .select('id, conversation_id, user_id, role, content, created_at')
    .single();

  if (error) {
    throw new Error(`Failed to persist message (${role}): ${error.message}`);
  }

  return data;
}

/**
 * End-to-end chat message processing workflow
 */
export async function processChatMessage({ supabase, userId, conversationId, message, requestId }) {
  let targetConversationId = conversationId;
  let conversationTitle = null;
  let isNewConversation = false;

  // 1. Resolve or create conversation
  if (targetConversationId) {
    const existing = await getConversationById(supabase, targetConversationId, userId);
    conversationTitle = existing.title;
  } else {
    // Generate an initial title from the message
    isNewConversation = true;
    const initialTitle = await generateConversationTitle(message);
    const newConv = await createConversation(supabase, userId, initialTitle);
    targetConversationId = newConv.id;
    conversationTitle = newConv.title;
  }

  // 2. Fetch previous history BEFORE adding this message
  let previousMessages = [];
  if (!isNewConversation) {
    previousMessages = await getConversationMessages(supabase, targetConversationId, userId, 30);
  }

  // 3. Persist the user message first (satisfies requirement to never discard user message on AI failure)
  const userMessage = await saveMessage(
    supabase,
    targetConversationId,
    userId,
    'user',
    message
  );

  // 4. If conversation had a generic title like 'New Chat' and was not just titled, update it
  if (!isNewConversation && (conversationTitle === 'New Chat' || !conversationTitle) && previousMessages.length === 0) {
    try {
      const generatedTitle = await generateConversationTitle(message);
      await supabase
        .from('conversations')
        .update({ title: generatedTitle })
        .eq('id', targetConversationId);
      conversationTitle = generatedTitle;
    } catch (e) {
      console.warn('[Chat Service] Background title generation skipped:', e.message);
    }
  }

  // 5. Generate AI response via Gemini SDK
  let assistantText;
  try {
    assistantText = await generateChatResponse(previousMessages, message);
  } catch (aiError) {
    // Note: User message is already safely stored in DB.
    // Attach targetConversationId and userMessage so client has full state.
    aiError.conversationId = targetConversationId;
    aiError.userMessage = userMessage;
    throw aiError;
  }

  // 6. Persist assistant message
  const assistantMessage = await saveMessage(
    supabase,
    targetConversationId,
    userId,
    'assistant',
    assistantText
  );

  // 7. Touch conversation's updated_at timestamp
  await touchConversation(supabase, targetConversationId);

  return {
    conversationId: targetConversationId,
    conversationTitle,
    userMessage,
    assistantMessage
  };
}

