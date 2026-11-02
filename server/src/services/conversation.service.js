/**
 * Conversation Service
 * Manages conversation CRUD and ownership operations in Supabase PostgreSQL
 */

export async function createConversation(supabase, userId, title = 'New Chat') {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        user_id: userId,
        title: title || 'New Chat'
      }
    ])
    .select('id, user_id, title, created_at, updated_at')
    .single();

  if (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }

  return data;
}

export async function getUserConversations(supabase, userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, user_id, title, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to retrieve conversations: ${error.message}`);
  }

  return data || [];
}

export async function getConversationById(supabase, conversationId, userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, user_id, title, created_at, updated_at')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    const notFoundError = new Error('Conversation not found or access denied.');
    notFoundError.statusCode = 404;
    notFoundError.code = 'CONVERSATION_NOT_FOUND';
    notFoundError.isPublic = true;
    throw notFoundError;
  }

  return data;
}

export async function renameConversation(supabase, conversationId, userId, title) {
  // First verify existence & ownership
  await getConversationById(supabase, conversationId, userId);

  const { data, error } = await supabase
    .from('conversations')
    .update({
      title,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId)
    .eq('user_id', userId)
    .select('id, user_id, title, created_at, updated_at')
    .single();

  if (error) {
    throw new Error(`Failed to rename conversation: ${error.message}`);
  }

  return data;
}

export async function deleteConversation(supabase, conversationId, userId) {
  // First verify existence & ownership
  await getConversationById(supabase, conversationId, userId);

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete conversation: ${error.message}`);
  }

  return true;
}

export async function touchConversation(supabase, conversationId) {
  const { error } = await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) {
    console.warn(`[Conversation Service] Failed to update timestamp for conversation ${conversationId}:`, error.message);
  }
}

