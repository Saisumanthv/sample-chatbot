import axios from 'axios';
import { supabase } from '../lib/supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 65000 // 65 seconds to allow AI generation
});

// Interceptor to inject the Supabase JWT token on every request
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn('[API Interceptor] Failed to fetch auth session:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';

    const enhancedError = new Error(message);
    enhancedError.statusCode = error.response?.status;
    enhancedError.code = error.response?.data?.error?.code;
    enhancedError.data = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

