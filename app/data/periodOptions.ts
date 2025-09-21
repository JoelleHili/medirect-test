import type { RadioGroupItem } from "@nuxt/ui";

export const periodOptions = ref<RadioGroupItem[]>([
  {
    label: "15M",
    value: "FX_INTRADAY&15min",
  },
  {
    label: "1H",
    value: "FX_INTRADAY&60min",
  },
  {
    label: "1D",
    value: "FX_DAILY",
  },
  {
    label: "1W",
    value: "FX_WEEKLY",
  },
  {
    label: "1M",
    value: "FX_MONTHLY",
  },
]);