import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import LoginView from '../views/LoginView.vue';
import MailingsView from '../views/MailingsView.vue';
import TemplatesView from '../views/TemplatesView.vue';
import MailingForm from '../components/MailingForm.vue';
import MailingScheduler from '../components/MailingScheduler.vue';
import TemplateForm from '../components/TemplateForm.vue';
import MailingShow from '../components/MailingShow.vue';
import TemplateShow from '../components/TemplateShow.vue';
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
      { path: 'create', component: MailingForm },
      { path: ':id', component: MailingShow },
      { path: 'edit/:id', component: MailingForm },
      { path: 'schedule/:id', component: MailingScheduler },
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/templates',
    children: [
      { path: '', name: 'templates', component: TemplatesView },
      { path: 'create', component: TemplateForm },
      { path: ':id', component: TemplateShow },
      { path: 'edit/:id', component: TemplateForm }
    ],
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
