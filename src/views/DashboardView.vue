<script setup>
import { ref } from 'vue';
import { useStatsStore } from '../stores/stats.js';
import { storeToRefs } from 'pinia';
import DashboardCard from '../components/DashboardCard.vue';
import Chart from '../components/Chart.vue';

const expandAllMailings = ref(false);
const expandMailingsToday = ref(false);
const expandDeliveredSms = ref(false);
const expandDeliveredEmails = ref(false);

const statsStore = useStatsStore();
const { stats, isLoading, error } = storeToRefs(statsStore);

function handleShowAllMailings() {
  expandAllMailings.value = !expandAllMailings.value;
}
function handleShowMailingsToday() {
  expandMailingsToday.value = !expandMailingsToday.value;
}
function handleShowDeliveredSms() {
  expandDeliveredSms.value = !expandDeliveredSms.value;
}
function handleShowDeliveredEmails() {
  expandDeliveredEmails.value = !expandDeliveredEmails.value;
}
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
        <v-col cols="12" sm="6" md="4" lg="3" class="position-relative">
          <DashboardCard title="Всего рассылок" :value="stats.totalMailings?.all" icon="mdi-email" 
            @click="handleShowAllMailings" />
          <v-fab-transition>
            <v-card v-show="expandAllMailings" class="position-absolute bottom-0 right-0 bg-primary pa-4" height="120" width="150">
              <v-row no-gutters>
                <v-col cols="8">Всего:</v-col>
                <v-col cols="4">{{ stats.totalMailings?.all }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="8">Успешно:</v-col>
                <v-col cols="4">{{ stats.totalMailings?.success }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="8">Частично:</v-col>
                <v-col cols="4">{{ stats.totalMailings?.partly }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="8">Ошибка:</v-col>
                <v-col cols="4">{{ stats.totalMailings?.error }}</v-col>
              </v-row>
            </v-card>
          </v-fab-transition>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3" class="position-relative">
          <DashboardCard title="Рассылок сегодня" :value="stats.mailingsToday?.all" icon="mdi-email-open" 
            @click="handleShowMailingsToday" />
          <v-fab-transition>
            <v-card v-show="expandMailingsToday" class="position-absolute bottom-0 right-0 bg-primary pa-4" height="120" width="150">
              <v-row no-gutters>
                <v-col cols="8">Всего:</v-col>
                <v-col cols="4">{{ stats.mailingsToday?.all }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="8">Успешно:</v-col>
                <v-col cols="4">{{ stats.mailingsToday?.success }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="8">Частично:</v-col>
                <v-col cols="4">{{ stats.mailingsToday?.partly }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="8">Ошибка:</v-col>
                <v-col cols="4">{{ stats.mailingsToday?.error }}</v-col>
              </v-row>
            </v-card>
          </v-fab-transition>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3" class="position-relative">
          <DashboardCard title="Доставлено SMS" :value="stats.deliveredSms?.all" icon="mdi-message-processing" 
            @click="handleShowDeliveredSms" />
          <v-fab-transition>
            <v-card v-show="expandDeliveredSms" class="position-absolute bottom-0 right-0 bg-primary pa-4" height="120" width="200">
              <v-row no-gutters>
                <v-col cols="9">Всего:</v-col>
                <v-col cols="3">{{ stats.deliveredSms?.all }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="9">Сегодня:</v-col>
                <v-col cols="3">{{ stats.deliveredSms?.today }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="9">Текущая неделя:</v-col>
                <v-col cols="3">{{ stats.deliveredSms?.week }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="9">Текущий месяц:</v-col>
                <v-col cols="3">{{ stats.deliveredSms?.month }}</v-col>
              </v-row>
            </v-card>
          </v-fab-transition>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3" class="position-relative">
          <DashboardCard title="Доставлено Email" :value="stats.deliveredEmails?.all" icon="mdi-email-arrow-right" 
            @click="handleShowDeliveredEmails" />
          <v-fab-transition>
            <v-card v-show="expandDeliveredEmails" class="position-absolute bottom-0 right-0 bg-primary pa-4" height="120" width="200">
              <v-row no-gutters>
                <v-col cols="9">Всего:</v-col>
                <v-col cols="3">{{ stats.deliveredEmails?.all }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="9">Сегодня:</v-col>
                <v-col cols="3">{{ stats.deliveredEmails?.today }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="9">Текущая неделя:</v-col>
                <v-col cols="3">{{ stats.deliveredEmails?.week }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="9">Текущий месяц:</v-col>
                <v-col cols="3">{{ stats.deliveredEmails?.month }}</v-col>
              </v-row>
            </v-card>
          </v-fab-transition>
        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col cols="12" md="6">
          <h2 class="text-h6">Активность рассылок за текущую неделю</h2>
          <Chart :data="stats.chartData.lastWeek" type="week" />
        </v-col>

        <v-col cols="12" md="6">
          <h2 class="text-h6">Активность рассылок за текущий месяц</h2>
          <Chart :data="stats.chartData.lastMonth" type="month" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
