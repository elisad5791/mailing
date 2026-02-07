<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import { useStatsStore } from './stores/stats.js';

const authStore = useAuthStore();
const router = useRouter();

const drawer = ref(false);
const { logout } = authStore;

const statStore = useStatsStore();
const { fetchStats, updateStat } = statStore;

let socket;

onMounted(async () => {
  await fetchStats();

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  socket = new WebSocket(`${wsProtocol}//${window.location.host}`);

  socket.addEventListener('message', async ({ data }) => {
    if (data == 'stat') {
      await fetchStats();
    }
  });

  socket.addEventListener('error', (err) => {
    console.error('Ws error', err);
  });
});

onUnmounted(() => {
  if(socket) {
    socket.close()
    socket = null
  }
});

function logoutUser() {
  logout();
  router.push('/login');
}

async function handleEmail(count) {
  await updateStat('email', count);

  if(socket.readyState === WebSocket.OPEN) {
    socket.send('stat');
  }
}

async function handleSms(count) {
  await updateStat('sms', count);

  if(socket.readyState === WebSocket.OPEN) {
    socket.send('stat');
  }
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
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-card-text>
          <router-view v-slot="{ Component }">
            <transition name="routing" mode="out-in">
              <component :is="Component" @email="handleEmail" @sms="handleSms" />
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
