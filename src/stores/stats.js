import { defineStore } from 'pinia';
import { apiClient } from '../api/client.js';
import { ref } from 'vue';

export const useStatsStore = defineStore('stats', function () {
  const stats = ref({
    mailingsTotal: 0,
    mailingsToday: 0,
    deliveredSms: 0,
    deliveredEmails: 0,
    chartData: { lastWeek: [], lastMonth: [] }
  });
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchStats() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get('/stats');
      stats.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Не удалось загрузить статистику';
      console.error('Ошибка загрузки статистики: ', err);
    } finally {
      isLoading.value = false;
    }
  };

  return { stats, isLoading, error, fetchStats };
});