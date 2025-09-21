// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/styles/main.css"],
  modules: ["@nuxt/ui-pro"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiUrl: "https://www.alphavantage.co/query?",
      apiKey: "SecretKey", //Create your own at: https://www.alphavantage.co/support/#api-key
      isDemo: true,
    },
  },
});
