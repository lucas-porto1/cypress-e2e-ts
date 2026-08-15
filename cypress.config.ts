import { createRequire } from 'node:module';

import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const require = createRequire(import.meta.url);
const registerMochawesomeReporter = require('cypress-mochawesome-reporter/plugin');

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and provide a value.`,
    );
  }

  return value;
}

export default defineConfig({
  allowCypressEnv: false,
  env: {
    STANDARD_USER: requireEnvironmentVariable('STANDARD_USER'),
    USER_PASSWORD: requireEnvironmentVariable('USER_PASSWORD'),
  },
  e2e: {
    baseUrl: requireEnvironmentVariable('BASE_URL'),
    setupNodeEvents(on) {
      registerMochawesomeReporter(on);
    },
    testIsolation: true,
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    reportPageTitle: 'Cypress E2E Test Report',
    saveAllAttempts: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  screenshotOnRunFailure: true,
  video: false,
});
