import { defineStore } from 'pinia';
import { apiClient } from '../api/client.js';
import { ref } from 'vue';

export const useMailingsStore = defineStore('mailings', function () {
  const mailings = ref([]);
  const currentMailing = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchMailings() {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get('/mailings?_sort=createdAt&_order=desc');
      mailings.value = response.data;
    } catch (err) {
      console.error('Ошибка при загрузке рассылок:', err);
      error.value = 'Не удалось загрузить список рассылок';
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchMailingById(id) {
    loading.value = true;
    currentMailing.value = null;
    error.value = null;

    try {
      const response = await apiClient.get(`/mailings/${id}`);
      currentMailing.value = response.data;
    } catch (err) {
      console.error(`Ошибка при загрузке рассылки с ID ${id}:`, err);
      error.value = 'Не удалось загрузить данные рассылки';
    } finally {
      loading.value = false;
    }
  }

  async function deleteMailing(id) {
    try {
      await apiClient.delete(`/mailings/${id}`)
      mailings.value = mailings.value.filter(mailing => mailing.id !== id);
      if (currentMailing.value?.id === id) {
        currentMailing.value = null;
      }
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении рассылки с ID ${id}:`, error);
      error.value = 'Не удалось удалить рассылку';
      return false;
    }
  }

  async function createMailing(data) {
    loading.value = true;
    data.recipients = data.recipients.split(',').map(item => item.trim());
    data.status = 'draft';
    data.createdAt = new Date();
    try {
      await apiClient.post('/mailings', data);
    } catch (err) {
      console.error('Ошибка при создании рассылки:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function updateMailing({ id, data }) {
    loading.value = true;
    data.recipients = data.recipients.split(',').map(item => item.trim());
    try {
      await apiClient.patch(`/mailings/${id}`, data);
      if (currentMailing.value?.id === id) {
        currentMailing.value = { ...currentMailing.value, ...data };
      }
    } catch (err) {
      console.error('Ошибка при обновлении рассылки:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return { mailings, currentMailing, loading, error, fetchMailings, fetchMailingById, deleteMailing, createMailing, updateMailing };
});