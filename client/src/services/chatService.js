import { api } from './api.js';

export const chatService = {
  async sendMessage({ conversationId, message, requestId }) {
    const res = await api.post('/chat', {
      conversationId: conversationId || null,
      message,
      requestId
    });
    return res;
  },

  async getMessages(conversationId) {
    const res = await api.get(`/conversations/${conversationId}/messages`);
    return res.data?.messages || [];
  },

  async getSuggestions() {
    const res = await api.get('/chat/suggestions');
    return res.data?.suggestions || [];
  }
};

