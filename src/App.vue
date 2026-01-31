<script setup>
import { ref, watchEffect } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.js';

const authStore = useAuthStore();
const router = useRouter();

const drawer = ref(false);
const { logout } = authStore;

function logoutUser() {
  logout();
  router.push('/login');
}

</script>

<template>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>
          <RouterLink :to="{ name: 'dashboard' }" class="link_clear">
            Кабинет администратора email и sms-рассылок
          </RouterLink>
        </v-toolbar-title>

        <RouterLink :to="{ name: 'login' }" class="link_clear" v-if="!authStore.isAuthenticated">Войти</RouterLink>
        <v-btn variant="text" @click="logoutUser" class="link_clear" v-else>Выйти</v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list>
          <v-list-item><RouterLink :to="{ name: 'dashboard' }" class="link_clear">Главная</RouterLink></v-list-item>
          <v-list-item><RouterLink :to="{ name: 'mailings' }" class="link_clear">Рассылки</RouterLink></v-list-item>
          <v-list-item><RouterLink :to="{ name: 'templates' }" class="link_clear">Шаблоны</RouterLink></v-list-item>
          <v-list-item><RouterLink :to="{ name: 'settings' }" class="link_clear">Настройки</RouterLink></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-card-text>
          <router-view v-slot="{ Component }">
            <transition name="routing" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </v-card-text>
      </v-main>
    </v-layout>
</template>

<style>
.link_clear {
  color: inherit;
  text-decoration: none;
  margin-right: 20px;
}

.routing-enter-active,
.routing-leave-active {
  transition: all 0.5s ease-out;
}

.routing-enter-from,
.routing-leave-to {
  transform: scale(0.4);
  opacity: 0;
}
</style>
