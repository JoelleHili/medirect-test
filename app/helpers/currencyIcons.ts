import * as currencyToFlag from "../data/currentyToFlags.json";

interface FormattedCurrency {
  label: string;
  value: string;
  icon: string;
}

const currencyToFlagList = currencyToFlag as Record<string, string>;

export const formatCurrencyList = (
  data: Record<string, string>
): FormattedCurrency[] => {
  const currenciesList: FormattedCurrency[] = Object.entries(data).map(
    ([code, name]) => ({
      label: name,
      value: code,
      icon: "circle-flags:" + (currencyToFlagList[code] ?? "xx"),
    })
  );

  return currenciesList;
};

export const getCurrencyIconFromCode = (code?: string) => {
  if (code) {
    return "circle-flags:" + (currencyToFlagList[code] ?? "xx");
  } else {
    return "";
  }
};
