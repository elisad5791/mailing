import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '../api/client.js';

export const useTemplatesStore = defineStore('templates', function() {
  const templates = ref([]);
  const currentTemplate = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const emailTemplates = computed(() => {
    return templates.value.filter(template => template.type === 'email');
  });

  const smsTemplates = computed(() => {
    return templates.value.filter(template => template.type === 'sms');
  });

  const fetchTemplates = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/templates');
      templates.value = response.data;
    } catch (err) {
      error.value = err.message || 'Не удалось загрузить шаблоны';
      console.error('Ошибка при загрузке шаблонов:', err);
    } finally {
      isLoading.value = false;
    }
  };

  async function fetchTemplateById(id) {
    isLoading.value = true;
    currentTemplate.value = null;
    error.value = null;

    try {
      const response = await apiClient.get(`/templates/${id}`);
      currentTemplate.value = response.data;
    } catch (err) {
      console.error(`Ошибка при загрузке шаблона с ID ${id}:`, err);
      error.value = 'Не удалось загрузить данные шаблона';
    } finally {
      isLoading.value = false;
    }
  }

  return { templates, isLoading, error, emailTemplates, smsTemplates, fetchTemplates, currentTemplate, fetchTemplateById };
});