<template>
  <main
    class="flex flex-col lg:flex-row gap-9 h-full items-center justify-center"
  >
    <!-- Selects -->
    <section
      class="flex flex-row lg:flex-col gap-2 lg:gap-8 w-full lg:w-96 justify-center"
    >
      <!-- Select Exchange -->
      <USelectMenu
        v-model="exchangeFrom"
        :items="currenciesList"
        value-key="value"
        :icon="selectedFromIcon"
        placeholder="Select Exchange"
        searchable
        :search-attributes="['label', 'value']"
        class="flex flex-row gap-2 bg-neutral-50 border-neutral-200 border-2 py-6 px-8 rounded-3xl justify-around lg:justify-between items-center w-64 lg:w-96 text-neutral-600"
        :ui="{
          leadingIcon: 'w-7 h-7',
          content: 'max-h-80 overflow-y-auto rounded-lg',
        }"
      >
        <template #item="{ item }">
          <div
            class="flex items-center gap-4 p-4 bg-neutral-50 w-64 lg:w-96 rounded-lg hover:bg-neutral-200"
          >
            <UIcon :name="item.icon" class="size-7" />
            <span class="text-md">{{ item.label }}</span>
          </div>
        </template>
      </USelectMenu>

      <!-- Select Symbol -->
      <USelectMenu
        v-model="exchangeTo"
        :items="currenciesList"
        value-key="value"
        :icon="selectedToIcon"
        placeholder="Select Symbol"
        searchable
        :search-attributes="['label', 'value']"
        class="flex flex-row gap-2 bg-neutral-50 border-neutral-200 border-2 py-6 px-8 rounded-3xl justify-around lg:justify-between items-center w-64 lg:w-96 text-neutral-600"
        :ui="{
          leadingIcon: 'w-7 h-7',
          content: 'max-h-80 overflow-y-auto rounded-lg',
        }"
      >
        <template #item="{ item }">
          <div
            class="flex items-center gap-4 p-4 bg-neutral-50 w-64 lg:w-96 rounded-3xl hover:bg-neutral-200"
          >
            <UIcon :name="item.icon" class="size-7" />
            <span class="text-md">{{ item.label }}</span>
          </div>
        </template>
      </USelectMenu>
    </section>
    <!-- Widget Container -->
    <section class="w-full">
      <!-- Widget -->
      <ForexWidget :exchange-from="exchangeFrom" :exchange-to="exchangeTo" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { formatCurrencyList } from "~/helpers/currencyIcons";
import { getCurrencyIconFromCode } from "~/helpers/currencyIcons";
import currencies from "../../data/currencies.json";

const countriesData = currencies as Record<string, string>;

const currenciesList = formatCurrencyList(countriesData);

const exchangeFrom = ref<string | undefined>();
const exchangeTo = ref<string | undefined>();

const selectedFromIcon = computed(() =>
  getCurrencyIconFromCode(exchangeFrom.value)
);
const selectedToIcon = computed(() =>
  getCurrencyIconFromCode(exchangeTo.value)
);
</script>
