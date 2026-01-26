<script setup>
import { ref, onMounted } from 'vue';
import { useMailingsStore } from '../stores/mailings';
import { storeToRefs } from 'pinia';
import { formatDate } from '../utils/helpers.js';
import { statuses } from '../data/statuses';
import { scheduleTypes } from '../data/types';

const deleting = ref(false);
const isExecuting = ref(false);

const mailingsStore = useMailingsStore();
const { mailings, loading, error } = storeToRefs(mailingsStore);
const { fetchMailings, deleteMailing } = mailingsStore;

onMounted(async function() {
  await fetchMailings();
});

async function handleDelete(id) {
  const success = await deleteMailing(id);
  if (success) {
    deleting.value = true;
  }
}

function handleAction(id) {
  const mailing = mailings.value.find((item) => item.id == id);
  const timeout = statuses[mailing['status']]['action_time'] * 1000;

  isExecuting.value = true;
  setTimeout(() => { 
    isExecuting.value = false; 
    const scheduleType = mailing['scheduleType'];
    const newStatus = statuses[mailing['status']]['status_after_action'][scheduleType];
    mailing['status'] = newStatus;
  }, timeout); 
}
</script>

<template>
  <RouterView />

   <div>
    <div>
      <h1>Управление рассылками</h1>
      <v-btn to="/mailings/create" color="primary" class="my-2">Создать</v-btn>
    </div>

    <v-alert text="Рассылка удалена" type="warning" v-if="deleting"></v-alert>

    <div class="text-center" v-if="loading" style="height:100px">
      <v-progress-circular color="primary" :size="70" indeterminate></v-progress-circular>
    </div>

    <div v-else-if="error">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
    </div>

    <div v-else-if="!mailings.length">
      Рассылок пока нет.
    </div>

    <v-table style="min-width:1200px" v-else>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Название</th>
          <th class="text-left font-weight-bold">Тип</th>
          <th class="text-left font-weight-bold">Статус</th>
          <th class="text-left font-weight-bold">Получатели</th>
          <th class="text-left font-weight-bold">Дата создания</th>
          <th class="text-left font-weight-bold">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mailing in mailings" :key="mailing.id">
          <td>{{ mailing.name }}</td>
          <td>
            <span>
              <v-icon icon="mdi-message-processing" v-if="mailing.type == 'sms'"/>
              <v-icon icon="mdi-email" v-else />
              {{ mailing.type.toUpperCase() }}
              <v-icon icon="mdi-arrow-up-bold-outline" v-if="mailing.scheduleType == 'immediate'"/>
              <v-icon icon="mdi-clock-outline" v-else-if="mailing.scheduleType == 'scheduled'"/>
              <v-icon icon="mdi-autorenew" v-else />
              {{ scheduleTypes[mailing.scheduleType].translation }}
            </span>
          </td>
          <td>
            <span>
              <v-icon :icon="statuses[mailing.status]['icon']" />
              {{ statuses[mailing.status]['translation'] }}
            </span>
          </td>
          <td>{{ mailing.recipients.length }}</td>
          <td>{{ formatDate(mailing.createdAt) }}</td>
          <td class="actions">
            <v-btn size="small" color="primary" variant="tonal" :to="'/mailings/'+mailing.id">Просмотр</v-btn>
            <v-btn size="small" color="success" variant="tonal" :to="'/mailings/edit/'+mailing.id" class="ms-2">
              Редактировать
            </v-btn>
            <v-btn size="small" color="error" variant="tonal" @click="handleDelete(mailing.id)" class="ms-2">
              Удалить
            </v-btn>
            <v-btn size="small" color="warning" variant="tonal" @click="handleAction(mailing.id)" class="ms-2">
              {{ statuses[mailing.status]['action'] }}
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="text-center mt-5" v-if="isExecuting">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>
