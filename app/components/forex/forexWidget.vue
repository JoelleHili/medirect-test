<template>
  <div class="bg-neutral-50 shadow-lg w-full rounded-3xl h-container py-4">
    <div v-if="exchangeFrom && exchangeTo">
      <!-- Widget Data -->
      <section class="px-7 pb-4">
        <section class="flex flex-row gap-1 items-center">
          <UIcon :name="getCurrencyIconFromCode(exchangeFrom)" class="size-8" />
          <UIcon :name="getCurrencyIconFromCode(exchangeTo)" class="size-8" />
          <a
            href="https://www.forex.com"
            class="px-5 py-3 rounded-3xl hover:bg-neutral-200 hover:cursor-pointer text-neutral-600"
            >Forex.com</a
          >
        </section>
        <section class="flex flex-row w-full justify-between content-start">
          <h1 class="text-4xl font-bold">
            {{ exchangeFrom }}/{{ exchangeTo }}
          </h1>
          <div>
            <!-- Current Value -->
            <h1 class="text-4xl font-normal text-right">
              {{ exchangeSymbol }} {{ parseFloat(exchangeRate).toFixed(2) }}
            </h1>

            <!-- First Closing Price to Last Closing Price -->
            <h2
              v-if="closeDifference > 0"
              class="text-2xl font-normal text-right text-green-400 flex gap-2 items-center justify-end"
            >
              <UIcon
                name="material-symbols:arrow-drop-up-rounded"
                class="size-6"
              />
              {{ closeDifferenceValue.toFixed(2) }} (+{{
                closeDifferencePercentage.toFixed(2)
              }}%)
            </h2>
            <h2
              v-else-if="closeDifference < 0"
              class="text-2xl font-normal text-right text-red-400 flex gap-2 items-center justify-end"
            >
              <UIcon
                name="material-symbols:arrow-drop-down-rounded"
                class="size-6"
              />
              {{ closeDifferenceValue.toFixed(2) }} ({{
                closeDifferencePercentage.toFixed(2)
              }}%)
            </h2>
            <h2
              v-else
              class="text-2xl font-normal text-right flex gap-2 items-center justify-end"
            >
              <UIcon
                name="material-symbols:horizontal-rule-rounded"
                class="size-6"
              />
              {{ closeDifferenceValue.toFixed(2) }} (0%)
            </h2>
          </div>
        </section>
      </section>
      <!-- Graph -->
      <section class="w-full h-56">
        <Graph
          :labels="timeseriesLabels || []"
          :data="timeseriesData || []"
          v-if="!errorMessage"
        ></Graph>
        <span v-else class="w-full h-full text-sm md:text-lg lg:text-xl text-red-800 font-medium text-center flex justify-center items-center p-5 lg:p-20">{{ errorMessage }}</span>
      </section>
      <!-- Radio Group -->
      <section class="p-3">
        <URadioGroup
          :items="periodOptions"
          v-model="selectedPeriod"
          orientation="horizontal"
          indicator="end"
          class="w-full items-center"
          :ui="{
            fieldset: 'justify-around gap-0 sm:justify-center sm:gap-4',
          }"
        >
          <template #label="label">
            <span
              :class="[
                'text-md px-4 py-2 hover:bg-neutral-200 rounded-lg',
                selectedPeriod === label.item.value ? ' bg-[#E2F4FF]' : '',
              ]"
              >{{ label.item.label }}</span
            >
          </template>
        </URadioGroup>
      </section>
    </div>
    <div
      v-else
      class="w-full h-full text-2xl text-neutral-600 font-medium flex justify-center items-center"
    >
      Please Select the Exchange and Symbol
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupValue } from "@nuxt/ui";
import { periodOptions } from "~/data/periodOptions";
import { useForexApi } from "~/helpers/apiQueryHandler";

import { getCurrencyIconFromCode } from "~/helpers/currencyIcons";
import { getCurrencySymbolFromCode } from "~/helpers/currencySymbols";

const {
  getHistoricalData,
  getExchangeRate,
  getHistoricalDataDemo,
  getExchangeRateDemo,
} = useForexApi();

const errorMessage = ref<string | null>();

const props = defineProps<{
  exchangeTo?: string;
  exchangeFrom?: string;
}>();

const exchangeSymbol = computed(() =>
  getCurrencySymbolFromCode(props.exchangeTo)
);

const selectedPeriod = ref<RadioGroupValue>("FX_DAILY");

const closeLatestValue = ref<number>(0);
const closeStartValue = ref<number>(0);
const closeDifference = computed(
  () => closeLatestValue.value - closeStartValue.value
);
const closeDifferencePercentage = computed(
  () => (closeDifference.value / closeStartValue.value) * 100
);
const closeDifferenceValue = computed(
  () =>
    (1 - 1 / (1 + closeDifferencePercentage.value / 100)) *
    parseFloat(exchangeRate.value)
);

const timeseriesLabels = ref<string[]>();
const timeseriesData = ref<number[]>();

const exchangeRate = ref();

const exchangeAPIResponse = ref();
const historicalAPIResponse = ref();

const runtimeConfig = useRuntimeConfig();

watch([() => props.exchangeFrom, () => props.exchangeTo], async () => {
  if (props.exchangeFrom && props.exchangeTo) {
    if (!runtimeConfig.public.isDemo) {
      exchangeAPIResponse.value = await getExchangeRate({
        fromSymbol: props.exchangeFrom,
        toSymbol: props.exchangeTo,
      });
    } else {
      exchangeAPIResponse.value = await getExchangeRateDemo();
    }
  }
});

watch(
  [selectedPeriod, () => props.exchangeFrom, () => props.exchangeTo],
  async () => {
    if (props.exchangeFrom && props.exchangeTo) {
      if (!runtimeConfig.public.isDemo) {
        historicalAPIResponse.value = await getHistoricalData({
          queryCode: selectedPeriod.value?.toString() || "",
          fromSymbol: props.exchangeFrom,
          toSymbol: props.exchangeTo,
        });
      } else {
        historicalAPIResponse.value = await getHistoricalDataDemo(
          selectedPeriod.value?.toString() || ""
        );
      }
    }
  }
);

watch([exchangeAPIResponse], () => {
  exchangeRate.value = exchangeAPIResponse.value;
});

watch([historicalAPIResponse], () => {
  const response = historicalAPIResponse.value;
  errorMessage.value = null;

  if (typeof response === "string") {
    errorMessage.value = response.toString();
  } else {
    timeseriesLabels.value = response.timeseriesLabels;
    timeseriesData.value = response.timeseriesData;

    closeLatestValue.value = timeseriesData.value?.at(-1) || 0;
    closeStartValue.value = timeseriesData.value?.at(0) || 0;
  }
});
</script>
