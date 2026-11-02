import { api } from './api.js';

export const conversationService = {
  async getConversations() {
    const res = await api.get('/conversations');
    return res.data?.conversations || [];
  },

  async getConversation(id) {
    const res = await api.get(`/conversations/${id}`);
    return res.data?.conversation;
  },

  async createConversation(title = 'New Chat') {
    const res = await api.post('/conversations', { title });
    return res.data?.conversation;
  },

  async renameConversation(id, title) {
    const res = await api.patch(`/conversations/${id}`, { title });
    return res.data?.conversation;
  },

  async deleteConversation(id) {
    const res = await api.delete(`/conversations/${id}`);
    return res.data;
  }
};

