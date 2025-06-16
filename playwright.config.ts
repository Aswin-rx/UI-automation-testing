import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  workers: 1,
  projects: [
     {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
        headless: false,
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:5173',
        headless: false,
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'iPhone 12',
      use: {
        ...devices['iPhone 12'],
        baseURL: 'http://localhost:5173',
        headless: false,
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'iPhone SE',
      use: {
        ...devices['iPhone SE'],
        baseURL: 'http://localhost:5173',
        headless: false,
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'iPad (gen 7)',
      use: {
        ...devices['iPad (gen 7)'],
        baseURL: 'http://localhost:5173',
        headless: false,
        launchOptions: {
          slowMo: 0,
        },
      },
    },
    {
      name: 'iPad Pro 11',
      use: {
        ...devices['iPad Pro 11'],
        baseURL: 'http://localhost:5173',
        headless: false,
        launchOptions: {
          slowMo: 0,
        },
      },
    },
  ],
  testDir: './tests',
});
