<script setup>
import { ref, onMounted } from 'vue';
import { useTemplatesStore } from '../stores/templates';
import { storeToRefs } from 'pinia';
import { formatDate } from '../utils/helpers.js';

const deleting = ref(false);

const templatesStore = useTemplatesStore();
const { templates, isLoading, error } = storeToRefs(templatesStore);
const { fetchTemplates, deleteTemplate } = templatesStore;

onMounted(async function() {
  await fetchTemplates();
});

async function handleDelete(id) {
  const success = await deleteTemplate(id);
  if (success) {
    deleting.value = true;
  }
}
</script>

<template>
  <RouterView />

   <div class="overflow-auto">
    <div>
      <h1>Управление шаблонами</h1>
      <v-btn to="/templates/create" color="primary" class="my-2">Создать</v-btn>
    </div>

    <v-alert text="Шаблон удален" type="warning" v-if="deleting"></v-alert>

    <div class="text-center" v-if="isLoading" style="height:100px">
      <v-progress-circular color="primary" :size="70" indeterminate></v-progress-circular>
    </div>

    <div v-else-if="error">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
    </div>

    <div v-else-if="!templates.length">
      Шаблонов пока нет.
    </div>

    <v-table style="min-width:1200px" v-else>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Название</th>
          <th class="text-left font-weight-bold">Тип</th>
          <th class="text-left font-weight-bold">Тема</th>
          <th class="text-left font-weight-bold">Дата создания</th>
          <th class="text-left font-weight-bold">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="template in templates" :key="template.id">
          <td>{{ template.name }}</td>
          <td>
            <span>
              <v-icon icon="mdi-message-processing" v-if="template.type == 'sms'"/>
              <v-icon icon="mdi-email" v-else />
              {{ template.type.toUpperCase() }}
            </span>
          </td>
          <td>{{ template.subject ?? '-' }}</td>
          <td>{{ formatDate(template.createdAt) }}</td>
          <td class="actions">
            <v-btn size="small" color="primary" variant="tonal" :to="'/templates/'+template.id">Просмотр</v-btn>
            <v-btn size="small" color="success" variant="tonal" :to="'/templates/edit/'+template.id" class="ms-2">
              Редактировать
            </v-btn>
            <v-btn size="small" color="error" variant="tonal" @click="handleDelete(template.id)" class="ms-2">
              Удалить
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

