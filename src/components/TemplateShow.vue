<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplatesStore } from '../stores/templates.js';
import { formatDate } from '../utils/helpers.js';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const templatesStore = useTemplatesStore();
const { currentTemplate , isLoading, error } = storeToRefs(templatesStore);
const { fetchTemplateById } = templatesStore;

onMounted(async function() {
  await fetchTemplateById(route.params.id);
});
</script>

<template>
  <div>
    <v-btn size="small" color="primary" variant="tonal" to="/templates">Назад к списку</v-btn>

    <div class="text-center mt-2" v-if="isLoading" style="height:100px">
      <v-progress-circular color="primary" :size="70" indeterminate></v-progress-circular>
    </div>

    <div v-else-if="error" class="mt-2">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
    </div>

    <div v-else-if="!currentTemplate" class="text-center">Шаблон не найден.</div>

    <v-row v-else>
      <v-col md="8" lg="6" class="mx-auto">
        <v-card class="mx-auto mt-4">
          <v-card-item>
            <div class="text-overline mb-4">Шаблон</div>
            <div class="text-h5 mb-4">
              {{ currentTemplate.name }}
            </div>

            <div class="mt-2">
              <v-icon icon="mdi-message-processing" v-if="currentTemplate.type == 'sms'"/>
              <v-icon icon="mdi-email" v-else />
              {{ currentTemplate.type.toUpperCase() }}
            </div>

            <p class="my-2">Создан: {{ formatDate(currentTemplate.createdAt) }}</p>

            <div v-if="currentTemplate.type == 'email'">
              <div class="text-h6 mt-4">Тема</div>
              <div>{{ currentTemplate.subject }}</div>
            </div>

            <div class="mb-4">
              <div class="text-h6 mt-4">Содержание</div>
              <div>{{ currentTemplate.body }}</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>