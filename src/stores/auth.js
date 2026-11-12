import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!localStorage.getItem('access_token'));
  const username = ref('');

  async function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      isAuthenticated.value = false;
      return false;
    }
    try {
      const { data } = await api.get('/api/auth/me/');
      isAuthenticated.value = true;
      username.value = data.user.username;
      return true;
    } catch (e) {
      isAuthenticated.value = false;
      return false;
    }
  }

  async function login(user, pass) {
    const { data } = await api.post('/api/auth/login/', { 
      username: user, 
      password: pass 
    });
    
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    await checkAuth();
  }

  async function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    isAuthenticated.value = false;
    username.value = '';
  }

  return { isAuthenticated, username, checkAuth, login, logout };
});