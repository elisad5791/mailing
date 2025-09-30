<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplatesStore } from '../stores/templates.js';
import { storeToRefs } from 'pinia';
import EmailEditor from './EmailEditor.vue';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const templateId = ref(route.params.id);

const templatesStore = useTemplatesStore();
const { isLoading, error, currentTemplate } = storeToRefs(templatesStore);
const { createTemplate, updateTemplate, fetchTemplateById } = templatesStore;

const name = ref('');
const type = ref('email');
const body = ref('');
const subject = ref('');

const formRef = ref(null);
const formError = ref('');

onMounted(async () => {
  if (isEditing.value) {
    await fetchTemplateById(templateId.value);
    setTimeout(() => {
      name.value = currentTemplate.value.name;
      type.value = currentTemplate.value.type;
      body.value = currentTemplate.value.body;
      subject.value = currentTemplate.value.subject;
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
    body: body.value,
    subject: type.value == 'email' ? subject.value : null
  };

  try {
    if (isEditing.value) {
      await updateTemplate({ id: templateId.value, data: values });
    } else {
      await createTemplate(values);
    }
    router.push('/templates');
  } catch (error) {
    console.error('Ошибка при сохранении шаблона:', error);
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
const bodyRules = ref([
  (value) => {
    if (value) return true;
    return 'Содержание обязательно.';
  },
  (value) => {
    if (value.length >= 3) return true;
    return 'Содержание должно содержать не менее 3 символов.';
  },
  (value) => {
    if (value.length <= 200 || type.value == 'email') return true;
    return 'Содержание sms должно содержать не более 200 символов.';
  },
]);
const subjectRules = ref([
  (value) => {
    if (value || type.value == 'sms') return true;
    return 'Тема обязательна.';
  },
  (value) => {
    if (value.length >= 3 || type.value == 'sms') return true;
    return 'Тема должна содержать не менее 3 символов.';
  },
]);
</script>

<template>
  <div class="overflow-auto">
    <h1>{{ isEditing ? 'Редактирование' : 'Создание' }} шаблона</h1>

    <div class="my-2">
      <v-btn size="small" color="primary" variant="tonal" to="/templates">Назад к списку</v-btn>
    </div>

    <div v-if="error" class="my-2">
      <v-alert :text="error" type="error" variant="tonal"></v-alert>
    </div>

    <v-form @submit.prevent="handleSubmit" ref="formRef">
      <v-responsive class="mx-auto" max-width="500">
        <div v-if="formError" class="my-2">
          <v-alert :text="formError" type="error" variant="tonal"></v-alert>
        </div>
        
        <v-text-field v-model="name" label="Название шаблона" :rules="nameRules" clearable></v-text-field>

        <v-radio-group inline class="mt-4" v-model="type">
          <v-radio label="Email" value="email"></v-radio>
          <v-radio label="СМС" value="sms"></v-radio>
        </v-radio-group>

        <v-text-field v-model="subject" label="Тема" :rules="subjectRules" clearable v-if="type == 'email'"></v-text-field>

        <EmailEditor  v-model="body" v-if="type == 'email'" />
        <v-textarea label="Содержание" class="mt-4" v-model="body" :rules="bodyRules" v-else></v-textarea>
        
        <div v-if="type == 'sms'">Символов: {{ body.length }} / 200</div>
        <div v-pre>
          Используйте переменные в двойных фигурных скобках,<br>например: {{name}}.
        </div>

        <div class="px-2 py-2 d-flex justify-space-between mt-4">
          <v-btn type="submit" color="primary" :disabled="isLoading">{{ isEditing ? 'Обновить' : 'Создать' }}</v-btn>
          <v-btn type="button" @click="$router.push('/templates')">Отменить</v-btn>
        </div>
      </v-responsive>
    </v-form>
  </div>
</template>