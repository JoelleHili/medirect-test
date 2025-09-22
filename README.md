# MeDirect Interview Assignment

This project is part of the MeDirect interview process.  
Refer to the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) for additional details.

---

## Setup

Install dependencies:

```bash
npm install
```

---

## API Setup

1. Generate a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key).
2. Open `nuxt.config.ts`.
3. Paste the generated API key into the `apiKey` field.
4. Set `isDemo` to `false`.  

   **Notes about `isDemo`:**
   - When `isDemo: true`, you can test intradaily calls (15M and 1H) but will give you the same 5M data.  
   - Keep `isDemo: true` if your main API key has reached its request limit .  
   - For real usage with your API key, set `isDemo: false`.  

---

## Development Server

Start the development server at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

---

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Notes

- This project is intended for **interview assessment purposes**.  
- Please make sure not to commit your **API key** to version control.  
