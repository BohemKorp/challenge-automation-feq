import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Test Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 60000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,
  
  // Reporter configuration
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    ['list'],
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }]
  ],

  // Global test settings
  use: {
    // Base URL for page.goto() calls
    baseURL: process.env.BASE_URL,
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Collect trace on failure
    trace: 'retain-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Maximum time for navigation
    navigationTimeout: 30000,
    
    // Maximum time for actions
    actionTimeout: 15000,
  },

  // Configure projects for different test types
  projects: [
    {
      name: 'API Tests - Pokemon',
      testMatch: '**/tests/api/pokemon.spec.ts',
      use: {
        baseURL: 'https://pokeapi.co/api/v2',
      },
    },
    {
      name: 'API Tests - JSONPlaceholder',
      testMatch: '**/tests/api/jsonplaceholder.spec.ts',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
    {
      name: 'Web Tests - Chromium',
      testMatch: '**/tests/web/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/',
});
