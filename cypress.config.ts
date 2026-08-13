import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

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
    testIsolation: true,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  screenshotOnRunFailure: true,
  video: false,
});
