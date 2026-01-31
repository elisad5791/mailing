<script setup>
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { daysOfWeek, daysOfMonth } from '@/data/calendar';
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js';

ChartJS.register(
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

const props = defineProps(['data', 'type']);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Количество рассылок',
      data: [],
      backgroundColor: 'rgba(24, 103, 192, 0.2)',
      borderColor: 'rgb(24, 103, 192)',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }
  ]
});

const options = ref({
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } },
  animation: { duration: 2000 } 
});

const days = daysOfWeek.map(item => item.label);

onMounted(() => {
  const len = props.data.length;
  const labels = props.type == 'week' ? days.slice(0, len) : daysOfMonth.slice(0, len);
  chartData.value = {
    labels: labels,
    datasets: [{ ...chartData.value.datasets[0], data: props.data }]
  };
});
</script>

<template>
  <div style="height:300px">
    <Line :data="chartData" :options="options" />
  </div>
</template>