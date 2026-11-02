import { api } from './api.js';

export const profileService = {
  async getProfile() {
    const res = await api.get('/profile');
    return res.data?.profile;
  },

  async updateProfile(fullName) {
    const res = await api.patch('/profile', { full_name: fullName });
    return res.data?.profile;
  }
};

