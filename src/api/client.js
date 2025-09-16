import axios from 'axios';
import { useAuthStore } from '../stores/auth.js';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(
  function(config) {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
)

apiClient.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
)
