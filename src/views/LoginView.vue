<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);

const formRef = ref(null);
const formError = ref('');

const form = ref({
  email: "",
  password: "",
});

async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    formError.value = 'Ошибка заполнения формы';
    return;
  }

  isLoading.value = true;
  formError.value = "";

  try {
    await authStore.login(form.value);
    router.push("/");
  } catch (error) {
    formError.value = error.response?.data?.message || 'Произошла ошибка при входе';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

const emailRules = ref([
  (value) => {
    if (value) return true;
    return 'Email обязателен.';
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) return true;
    return 'Email должен быть валидным.';
  },
]);

const passwordRules = ref([
  (value) => {
    if (value.length >= 6) return true;
    return 'Минимальная длина пароля 6 символов.';
  }
]);
</script>

<template>
  <h1>Вход в кабинет</h1>

  <v-sheet class="mx-auto" width="300">
    <v-form @submit.prevent="handleSubmit" ref="formRef">
      <div v-if="formError" class="my-2">
        <v-alert :text="formError" type="error" variant="tonal"></v-alert>
      </div>
      <v-text-field v-model="form.email" :rules="emailRules" label="Email" :disabled="isLoading"></v-text-field>
      <v-text-field v-model="form.password" :rules="passwordRules" label="Пароль" type="password" class="mt-2" :disabled="isLoading">
      </v-text-field>
      <v-btn class="mt-2" type="submit" block :disabled="isLoading">
        <span v-if="isLoading">Вход...</span>
        <span v-else>Войти</span>
      </v-btn>
    </v-form>
  </v-sheet>
</template>
