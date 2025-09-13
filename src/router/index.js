import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import MailingsView from '../views/MailingsView.vue'
import TemplatesView from '../views/TemplatesView.vue'
import SettingsView from '../views/SettingsView.vue'
import MailingsCreate from '../components/MailingsCreate.vue';
import MailingsShow from '../components/MailingsShow.vue';
import { useAuthStore } from '../stores/auth.js';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/mailings',
    children: [
      { path: '', name: 'mailings', component: MailingsView },
      { path: 'create', component: MailingsCreate },
      { path: ':id', component: MailingsShow },
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/templates',
    name: 'templates',
    component: TemplatesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
