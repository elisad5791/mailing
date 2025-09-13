<script setup>
import { onMounted } from 'vue';
import { apiClient } from '../api/client.js';
import { useStatsStore } from '../stores/stats.js';
import { storeToRefs } from 'pinia';
import DashboardCard from '../components/DashboardCard.vue';
import Chart from '../components/Chart.vue';

const statsStore = useStatsStore();
const { stats, isLoading, error } = storeToRefs(statsStore);
const { fetchStats } = statsStore;

onMounted(async function () {
  fetchStats();
});
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Главная панель</h1>

    <div class="text-center" v-if="isLoading">
      <v-progress-circular color="primary" :size="70" indeterminate></v-progress-circular>
    </div>

    <div v-else-if="error">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
      <v-btn @click="fetchStats" class="mt-2">Попробовать снова</v-btn>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <DashboardCard title="Всего рассылок" :value="stats.totalMailings" icon="mdi-email" />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <DashboardCard title="Рассылок сегодня" :value="stats.mailingsToday" icon="mdi-email-open" />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <DashboardCard title="Доставлено SMS" :value="stats.deliveredSms" icon="mdi-message-processing" />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <DashboardCard title="Доставлено Email" :value="stats.deliveredEmails" icon="mdi-email-arrow-right" />
        </v-col>
      </v-row>

      <div class="mt-4">
        <h2 class="text-h6">Активность рассылок за неделю</h2>
        <Chart :data="stats.chartData.lastWeek" />
      </div>
    </div>
  </div>
</template>
