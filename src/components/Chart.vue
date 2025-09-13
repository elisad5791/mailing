<template>
  <div style="height:300px">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

const props = defineProps(['data']);

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
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
});

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].slice(0, newData.length);
    chartData.value = {
      labels: labels,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: newData
        }
      ]
    };
  }
}, { immediate: true });

</script>