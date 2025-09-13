<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
  email: "",
  password: "",
});

async function handleSubmit() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await authStore.login(form.value);
    router.push("/");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Произошла ошибка при входе';
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
    <v-alert :text="errorMessage" type="error" class="mb-4" v-if="errorMessage"></v-alert>

    <v-form fast-fail @submit.prevent="handleSubmit">
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
