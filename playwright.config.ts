import { defineConfig,devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
    headless: false, // Always run in headed mode
    launchOptions: {
      slowMo:0,
    },
  },
  testDir: './tests',
});
