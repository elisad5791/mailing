<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMailingsStore } from '../stores/mailings.js';
import { storeToRefs } from 'pinia';
import { recurrenceList } from '@/data/calendar.js';  
import { daysOfWeek } from '@/data/calendar.js';  
import { daysOfMonth } from '@/data/calendar.js';  

const route = useRoute();
const router = useRouter();
const mailingId = route.params.id;

const formRef = ref(null);
const formError = ref('');

const mailingsStore = useMailingsStore();
const { currentMailing } = storeToRefs(mailingsStore);
const { updateMailing, fetchMailingById } = mailingsStore;

const scheduleType = ref('immediate');
const scheduleDate = ref(null);
const scheduleTime = ref(null);
const recurrenceType = ref('daily');
const recurrenceDays = ref(['mon']);
const recurrenceNums = ref([1]);

onMounted(async () => {
  await fetchMailingById(mailingId);
  setTimeout(() => {
    scheduleType.value = currentMailing.value.scheduleType;
    if (currentMailing.value.scheduleData) {
      if (currentMailing.value.scheduleData.date) {
        scheduleDate.value = currentMailing.value.scheduleData.date;
      }
      if (currentMailing.value.scheduleData.time) {
        scheduleTime.value = currentMailing.value.scheduleData.time;
      }
      if (currentMailing.value.scheduleData.recurrence) {
        recurrenceType.value = currentMailing.value.scheduleData.recurrence;
      }
      if (currentMailing.value.scheduleData.days) {
        recurrenceDays.value = currentMailing.value.scheduleData.days;
      }
      if (currentMailing.value.scheduleData.nums) {
        recurrenceNums.value = currentMailing.value.scheduleData.nums;
      }
    }
  }, 0);
});

const isRecurrence = computed(() => scheduleType.value == 'recurring');
const isDaily = computed(() => {
  const cond1 = scheduleType.value == 'recurring';
  const cond2 = recurrenceType.value == 'daily';
  return cond1 && cond2;
});
const isWeekly = computed(() => {
  const cond1 = scheduleType.value == 'recurring';
  const cond2 = recurrenceType.value == 'weekly';
  return cond1 && cond2;
});
const isMontly = computed(() => {
  const cond1 = scheduleType.value == 'recurring';
  const cond2 = recurrenceType.value == 'monthly';
  return cond1 && cond2;
});
const isScheduled = computed(() => scheduleType.value == 'scheduled');

async function handleSubmit() {
  const values = { scheduleType: scheduleType.value, status: 'draft' };

  if (scheduleType.value == 'scheduled') {
    const data = { date: scheduleDate.value, time: scheduleTime.value };
    values.scheduleData = data;
  }

  if (scheduleType.value == 'recurring' && recurrenceType.value == 'daily') {
    const data = { recurrence: 'daily', time: scheduleTime.value };
    values.scheduleData = data;
  }

  if (scheduleType.value == 'recurring' && recurrenceType.value == 'weekly') {
    const data = { recurrence: 'weekly', days: recurrenceDays.value, time: scheduleTime.value };
    values.scheduleData = data;
  }

  if (scheduleType.value == 'recurring' && recurrenceType.value == 'monthly') {
    const data = { recurrence: 'monthly', nums: recurrenceNums.value, time: scheduleTime.value };
    values.scheduleData = data;
  }

  values.name = currentMailing.value.name;
  values.type = currentMailing.value.type;
  values.recipients = currentMailing.value.recipients.join(',');
  values.templateId = currentMailing.value.templateId;
  values.createdAt = currentMailing.value.createdAt;

  try {
    await updateMailing({ id: mailingId, data: values });
    router.push('/mailings/edit/'+mailingId);
  } catch (error) {
    console.error('Ошибка при сохранении графика рассылки:', error);
  }
}

function cancel() {
  router.push('/mailings/edit/'+mailingId);
}
</script>

<template>
<div class="overflow-auto">
  <h1>Расписание отправки</h1>
  <div class="my-2">
    <v-btn size="small" color="primary" variant="tonal" :to="'/mailings/edit/'+mailingId">Назад к редактированию</v-btn>
  </div>

  <v-form @submit.prevent="handleSubmit" ref="formRef">
    <v-responsive class="mx-auto px-4 py-4" max-width="700">
      <div v-if="formError" class="my-2">
        <v-alert :text="formError" type="error" variant="tonal"></v-alert>
      </div>
      
      <v-radio-group v-model="scheduleType">
        <v-radio label="Отправить немедленно" value="immediate"></v-radio>
        <v-radio label="Запланировать" value="scheduled"></v-radio>
        <v-radio label="Повторяющаяся" value="recurring"></v-radio>
      </v-radio-group>

      <transition name="scheduling" mode="out-in">
          <div v-if="isScheduled" class="d-flex justify-space-between">
            <v-date-picker v-model="scheduleDate"></v-date-picker>
            <v-time-picker format="24hr" v-model="scheduleTime"></v-time-picker>
          </div>
          <div v-else-if="isDaily">
            <v-time-picker format="24hr" v-model="scheduleTime"></v-time-picker>
          </div>
          <div v-else-if="isWeekly" class="d-flex justify-space-between">
            <div>
              <v-checkbox density="compact" hide-details v-model="recurrenceDays" color="primary"
                v-for="item in daysOfWeek" :key="item.value" :label="item.label" :value="item.value"></v-checkbox>
            </div>
            <v-time-picker format="24hr" v-model="scheduleTime"></v-time-picker>
          </div>
          <div v-else-if="isMontly" class="d-flex justify-space-between">
            <v-container>
              <v-row no-gutters>
                <v-col v-for="item in daysOfMonth" :key="item" cols="4">
                  <v-checkbox density="compact" hide-details v-model="recurrenceNums" color="primary"
                    :label="item" :value="item"></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
            <v-time-picker format="24hr" v-model="scheduleTime"></v-time-picker>
          </div>
      </transition>

      <v-select label="Периодичность" :items="recurrenceList" v-model="recurrenceType" v-if="isRecurrence">
      </v-select>
      
      <div class="py-4 d-flex justify-space-between">
        <v-btn type="submit" color="primary">Сохранить</v-btn>
        <v-btn type="button" class="ml-3" @click="cancel">Отменить</v-btn>
      </div>
    </v-responsive>
  </v-form>
</div>
</template>

<style scoped>
  .scheduling-enter-active {
    transition: all 0.8s ease-out;
  }

  .scheduling-leave-active {
    transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .scheduling-enter-from,
  .scheduling-leave-to {
    transform: translateX(30%);
    opacity: 0;
  }
</style>