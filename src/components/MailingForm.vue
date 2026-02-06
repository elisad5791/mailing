<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMailingsStore } from '../stores/mailings.js';
import { useTemplatesStore } from '../stores/templates.js';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const mailingId = ref(route.params.id);

const mailingsStore = useMailingsStore();
const { loading, error, currentMailing } = storeToRefs(mailingsStore);
const { createMailing, updateMailing, fetchMailingById } = mailingsStore;

const templatesStore = useTemplatesStore();
const { emailTemplates, smsTemplates } = storeToRefs(templatesStore);
const { fetchTemplates } = templatesStore;

const eTemplates = computed(() => emailTemplates.value.map((item) => ({ title: item.name, value: item.id })));
const sTemplates = computed(() => smsTemplates.value.map((item) => ({ title: item.name, value: item.id })));

const name = ref('');
const type = ref('email');
const template = ref(null);
const recipients = ref('');

const fileInput = ref(null);
const formRef = ref(null);
const formError = ref('');

function handleCsvUpload() {
  fileInput.value.click();
};

function processCsv(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const csvText = e.target.result;
    const lines = csvText.split('\n');
    const items = [];
    
    for (let line of lines) {
      const firstColumn = line.split(',')[0]?.trim();
      if (firstColumn) {
        items.push(firstColumn);
      }
    }
    
    recipients.value = items.join(', ');
  };
  
  reader.readAsText(file);
};

onMounted(async () => {
  await fetchTemplates();
  if (isEditing.value) {
    await fetchMailingById(mailingId.value);
    setTimeout(() => {
      name.value = currentMailing.value.name;
      type.value = currentMailing.value.type;
      template.value = currentMailing.value.Template.id;
      recipients.value = currentMailing.value.recipients.join(',');
    }, 0);
  }
});

async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    formError.value = 'Ошибка заполнения формы';
    return;
  }

  const values = {
    name: name.value,
    type: type.value,
    template_id: template.value,
    recipients: recipients.value
  };
  try {
    if (isEditing.value) {
      values.status = currentMailing.value.status;
      values.scheduleType = currentMailing.value.scheduleType;
      values.createdAt = currentMailing.value.createdAt;
      await updateMailing({ id: mailingId.value, data: values });
    } else {
      values.status = 'draft';
      values.scheduleType = 'immediate';
      await createMailing(values);
    }
    router.push('/mailings');
  } catch (error) {
    console.error('Ошибка при сохранении рассылки:', error);
  }
}

const nameRules = ref([
  (value) => {
    if (value) return true;
    return 'Название обязательно.';
  },
  (value) => {
    if (value.length >= 3) return true;
    return 'Название должно содержать не менее 3 символов.';
  },
]);
const templateRules = ref([
  (value) => {
    if (value) return true;
    return 'Выберите тип.';
  },
]);
const recRules = ref([
  (value) => {
    if (value) return true;
    return 'Список получателей обязателен.';
  },
  (value) => {
    const items = value.split(',').map(item => item.trim());
    let check = true;
    for (let item of items) {
      const regex = type.value == 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : /^[\d\s\(\)\-\+]+$/;
      if (!regex.test(item)) {
        check = false;
        break;
      }
    }
    if (check) return true;
    return 'Неверный формат получателей.';
  },
]);
</script>

<template>
  <div class="overflow-auto">
    <h1>{{ isEditing ? 'Редактирование' : 'Создание' }} рассылки</h1>

    <div class="my-2">
      <v-btn size="small" color="primary" variant="tonal" to="/mailings">Назад к списку</v-btn>
    </div>
    <div v-if="!isEditing" class="my-2">
      <v-btn size="small" color="success" variant="tonal" @click="handleCsvUpload">Загрузить получателей из CSV</v-btn>
      <input type="file" ref="fileInput" accept=".csv" style="display: none" @change="processCsv">
    </div>

    <div v-if="error" class="my-2">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
    </div>

    <v-form @submit.prevent="handleSubmit" ref="formRef">
      <v-responsive class="mx-auto" max-width="500">
        <div v-if="formError" class="my-2">
          <v-alert :text="formError" type="error" variant="tonal"></v-alert>
        </div>
        
        <v-text-field v-model="name" label="Название рассылки" :rules="nameRules" clearable></v-text-field>

        <v-radio-group inline class="mt-4" v-model="type">
          <v-radio label="Email" value="email"></v-radio>
          <v-radio label="СМС" value="sms"></v-radio>
        </v-radio-group>

        <v-select label="Шаблон" :items="eTemplates" v-model="template" :rules="templateRules" v-if="type == 'email'"></v-select>
        <v-select label="Шаблон" :items="sTemplates" v-model="template"  :rules="templateRules" v-else></v-select>

        <v-textarea label="Получатели (через запятую)" class="mt-4" v-model="recipients" :rules="recRules"></v-textarea>

        <div class="px-2 py-2 d-flex justify-space-between">
          <div>
            <v-btn :to="'/mailings/schedule/'+mailingId" color="success" v-if="isEditing">Планировщик</v-btn>
          </div>
          <div>
            <v-btn type="submit" color="primary" :disabled="loading">{{ isEditing ? 'Обновить' : 'Создать' }}</v-btn>
            <v-btn type="button" class="ml-3" @click="$router.push('/mailings')">Отменить</v-btn>
          </div>
        </div>
      </v-responsive>
    </v-form>
  </div>
</template>