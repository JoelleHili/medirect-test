interface HistoricalAPIQueryTypes {
  queryCode: string;
  fromSymbol?: string;
  toSymbol?: string;
}

interface ExchangeAPIQueryTypes {
  fromSymbol?: string;
  toSymbol?: string;
}

type OHLCTypes = {
  "1. open": number;
  "2. high": number;
  "3. low": number;
  "4. close": number;
};

export function useForexApi() {
  const runtimeConfig = useRuntimeConfig();

  const formatHistoricalAPIQuery = ({
    queryCode,
    fromSymbol,
    toSymbol,
  }: HistoricalAPIQueryTypes) => {
    const fromSymbolURL = "&from_symbol=" + fromSymbol;
    const toSymbolURL = "&to_symbol=" + toSymbol;
    const apiKeyUrl = "&apikey=" + runtimeConfig.public.apiKey;

    if (queryCode.includes("&")) {
      const [fn, interval] = queryCode.split("&");
      return `${runtimeConfig.public.apiUrl}function=${fn}${fromSymbolURL}${toSymbolURL}&interval=${interval}${apiKeyUrl}`;
    }

    return `${runtimeConfig.public.apiUrl}function=${queryCode}${fromSymbolURL}${toSymbolURL}${apiKeyUrl}`;
  };

  const formatExchangeAPIQuery = ({
    fromSymbol,
    toSymbol,
  }: ExchangeAPIQueryTypes) => {
    return `${runtimeConfig.public.apiUrl}function=CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=${toSymbol}&apikey=${runtimeConfig.public.apiKey}`;
  };

  const getHistoricalData = async ({
    queryCode,
    fromSymbol,
    toSymbol,
  }: HistoricalAPIQueryTypes) => {
    const requestURL = formatHistoricalAPIQuery({
      queryCode,
      fromSymbol,
      toSymbol,
    });

    try {
      const res = await fetch(requestURL);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      
      if (data["Information"]) throw new Error(data["Information"]);

      const timeseries =
        data["Time Series FX (Daily)"] ||
        data["Time Series FX (15min)"] ||
        data["Time Series FX (60min)"] ||
        data["Time Series FX (Weekly)"] ||
        data["Time Series FX (Monthly)"] ||
        {};

      const parsedTimeseries = Object.entries(timeseries) as [
        string,
        OHLCTypes
      ][];
      const timeseriesData = parsedTimeseries.slice(0, 100);
      timeseriesData.reverse();

      return {
        timeseriesLabels: timeseriesData.map(([time]) => time),
        timeseriesData: timeseriesData.map(([_, ohlc]) =>
          Number(ohlc["4. close"])
        ),
      };
    } catch (err) {
      const errorMessage = (err as Error).message;

      console.error(errorMessage);
      return errorMessage || "Failed to fetch historical data";
    }
  };

  const getExchangeRate = async ({
    fromSymbol,
    toSymbol,
  }: ExchangeAPIQueryTypes) => {
    const requestURL = formatExchangeAPIQuery({ fromSymbol, toSymbol });

    try {
      const res = await fetch(requestURL);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      return data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
    } catch (err) {
      const errorMessage = (err as Error).message;

      console.error(errorMessage);
      return errorMessage || "Failed to fetch exchange rate";
    }
  };

  const getHistoricalDataDemo = async (type: string) => {
    let demoURL = "";

    switch (type) {
      case "FX_INTRADAY&15min":
        demoURL =
          "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo";
        break;
      case "FX_INTRADAY&60min":
        demoURL =
          "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo";
        break;
      case "FX_DAILY":
        demoURL =
          "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=demo";
        break;
      case "FX_WEEKLY":
        demoURL =
          "https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=EUR&to_symbol=USD&apikey=demo";
        break;
      case "FX_MONTHLY":
        demoURL =
          "https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=EUR&to_symbol=USD&apikey=demo";
        break;
    }

    try {
      const res = await fetch(demoURL);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();

      const timeseries =
        data["Time Series FX (Daily)"] ||
        data["Time Series FX (5min)"] ||
        data["Time Series FX (Weekly)"] ||
        data["Time Series FX (Monthly)"] ||
        {};

      const parsedTimeseries = Object.entries(timeseries) as [
        string,
        OHLCTypes
      ][];
      const timeseriesData = parsedTimeseries.slice(0, 100);
      timeseriesData.reverse();

      return {
        timeseriesLabels: timeseriesData.map(([time]) => time),
        timeseriesData: timeseriesData.map(([_, ohlc]) =>
          Number(ohlc["4. close"])
        ),
      };
    } catch (err) {
      const errorMessage = (err as Error).message;

      console.error(errorMessage);
      return errorMessage || "Failed to fetch demo historical data";
    }
  };

  const getExchangeRateDemo = async () => {
    try {
      const res = await fetch(
        "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo"
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      return data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
    } catch (err) {
      const errorMessage = (err as Error).message;

      console.error(errorMessage);
      return errorMessage || "Failed to fetch demo exchange rate";
    }
  };

  // ----------------------
  // Expose functions
  // ----------------------
  return {
    getHistoricalData,
    getExchangeRate,
    getHistoricalDataDemo,
    getExchangeRateDemo,
  };
}
