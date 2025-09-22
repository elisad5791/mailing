<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMailingsStore } from '../stores/mailings.js';
import { statusRussian, formatDate } from '../utils/helpers.js';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const mailingsStore = useMailingsStore();
const { currentMailing , loading, error } = storeToRefs(mailingsStore);
const { fetchMailingById, deleteMailing } = mailingsStore;

onMounted(async function() {
  await fetchMailingById(route.params.id);
});

async function handleDelete() {
    const success = await deleteMailing(currentMailing.value.id);
    if (success) {
      router.push('/mailings');
    }
}
</script>

<template>
  <div>
    <v-btn size="small" color="primary" variant="tonal" to="/mailings">Назад к списку</v-btn>

    <div class="text-center mt-2" v-if="loading" style="height:100px">
      <v-progress-circular color="primary" :size="70" indeterminate></v-progress-circular>
    </div>

    <div v-else-if="error" class="mt-2">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
    </div>

    <div v-else-if="!currentMailing" class="text-center">Рассылка не найдена.</div>

    <v-row v-else>
      <v-col md="8" lg="6" class="mx-auto">
        <v-card color="primary" variant="outlined" class="mx-auto mt-4">
          <v-card-item>
            <div class="text-overline mb-4">
              Шаблон: {{ currentMailing.templateId }}
            </div>
            <div class="text-h5 mb-4">
              {{ currentMailing.name }}
            </div>

            <div class="d-flex mt-2">
              <p>
                <v-icon icon="mdi-message-processing" v-if="currentMailing.type == 'sms'"/>
                <v-icon icon="mdi-email" v-else />
                {{ currentMailing.type.toUpperCase() }}
              </p>
              <p class="ms-2">
                <v-icon icon="mdi-check" v-if="currentMailing.status == 'completed'" />
                <v-icon icon="mdi-clock-edit-outline" v-else />
                {{ statusRussian(currentMailing.status) }}
              </p>
            </div>

            <p class="my-2">Создана: {{ formatDate(currentMailing.createdAt) }}</p>

            <div class="text-h6 mt-4" v-if="currentMailing.stats">Статистика отправки</div>
            <v-chip-group v-if="currentMailing.stats">
              <v-chip>Всего: {{ currentMailing.stats.total }}</v-chip>
              <v-chip>Успешно: {{ currentMailing.stats.delivered }}</v-chip>
              <v-chip>Ошибки: {{ currentMailing.stats.failed }}</v-chip>
            </v-chip-group>

            <v-card-actions>
              <v-btn color="error" variant="tonal" size="small" @click="handleDelete(currentMailing.id)">Удалить рассылку</v-btn>
            </v-card-actions>

            <v-list>
              <div class="font-weight-bold">ПОЛУЧАТЕЛИ</div>
              <v-list-item color="primary" rounded="shaped" v-for="(recipient, index) in currentMailing.recipients" :value="recipient" :key="index">
                <v-list-item-title v-text="recipient"></v-list-item-title>
              </v-list-item>
            </v-list>

          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>