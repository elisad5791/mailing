import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '../api/client.js';

export const useAuthStore = defineStore('auth', function () {
  const user = ref(JSON.parse(localStorage.getItem('user') || null));
  const token = ref(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }

  function setUser(userData) {
    user.value = userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  }

  async function login(credentials) {
    const response = await apiClient.post('/login', credentials);
    
    const { token: newToken, user: userData } = response.data;
    setToken(newToken);
    setUser(userData);
    
    return response;
  };

  function logout() {
    setToken(null);
    setUser(null);
  }

  function checkAuth() {
    return !!token.value;
  };

  return { user, token, isAuthenticated, setToken, setUser, login, logout, checkAuth };
});
