<script setup>
import { ref, onMounted } from 'vue';
import { useMailingsStore } from '../stores/mailings';
import { storeToRefs } from 'pinia';
import { statusRussian, formatDate } from '../utils/helpers.js';

const deleting = ref(false);

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
</script>

<template>
  <RouterView />

   <div class="overflow-auto">
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
            </span>
          </td>
          <td>
            <span>
              <v-icon icon="mdi-check" v-if="mailing.status == 'completed'" />
              <v-icon icon="mdi-clock-edit-outline" v-else />
              {{ statusRussian(mailing.status) }}
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
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
