<script setup lang="ts">
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
} from "chart.js";
import { Line } from "vue-chartjs";
import { computed } from "vue";

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

const props = defineProps<{
  labels: string[],
  data: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "My Data",
      data: props.data,
      borderColor: "green",
      borderWidth: 2,
      fill: true,
      tension: 0,
      pointRadius: 0,
      pointHitRadius: 10,
      backgroundColor: (ctx: any) => {
        const { chart } = ctx;
        const { ctx: canvasCtx, chartArea } = chart;

        if (!chartArea) {
          return null;
        }

        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "#E8F4D4");
        gradient.addColorStop(1, "#F7FBEF");
        return gradient;
      }
    },
  ],
}));

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      ticks: { display: false },
      grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
      border: { display: false },
    },
    y: {
      ticks: { display: false },
      grid: { drawTicks: false, drawBorder: false, drawOnChartArea: false },
      border: { display: false },
    },
  },
};
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>