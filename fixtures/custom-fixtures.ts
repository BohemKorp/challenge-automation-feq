import { test as base } from '@playwright/test';
import { encryptSHA256 } from '../utils/crypto-helper';
import { getSecretKey } from '../config/environment';
import { createLogger, Logger } from '../utils/logger';
import { readExcelData, getTestDataPath } from '../utils/excel-reader';
import { PokemonData } from '../config/test-data';

/**
 * Custom fixtures extending Playwright's base test
 * This fixture automatically encrypts and logs the secret key before each test
 */
type CustomFixtures = {
  encryptedKey: string;
  logTest: Logger;
  testData: PokemonData[];
};

/**
 * Extended test with custom fixtures
 * - encryptedKey: Automatically encrypts the secret key and logs it before each test
 * - logTest: Logger instance for test logging
 * - testData: Pokemon data read from Excel file
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Fixture that encrypts the secret key and logs it before each test
   * This replaces the beforeEach hook as required by the challenge
   * Auto-fixture: executes automatically before each test
   */
  encryptedKey: [async ({}, use) => {
    const secretKey = getSecretKey();
    const encrypted = encryptSHA256(secretKey);
    
    // Log the encrypted key before each test
    console.log(`\n========================================`);
    console.log(`Encrypted Secret Key: ${encrypted}`);
    console.log(`========================================\n`);
    
    await use(encrypted);
  }, { auto: true }],

  /**
   * Logger fixture for test execution logging
   */
  logTest: async ({}, use) => {
    const logger = createLogger();
    await use(logger);
  },

  /**
   * Test data fixture that reads Pokemon data from Excel file
   */
  testData: async ({}, use) => {
    const dataPath = getTestDataPath();
    const data = readExcelData(dataPath);
    await use(data);
  }
});

export { expect } from '@playwright/test';
