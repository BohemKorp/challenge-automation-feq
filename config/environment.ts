import * as dotenv from 'dotenv';
import { TestConfig } from './test-data';

// Load environment variables from .env file
dotenv.config();

/**
 * Gets the current environment configuration
 * @returns TestConfig object with environment and secret key
 */
export function getEnvironmentConfig(): TestConfig {
  const env = (process.env.TEST_ENV ?? 'qa').toLowerCase() as 'qa' | 'cert';
  
  let secretKey: string;
  
  // Get secret key based on environment
  if (env === 'qa') {
    secretKey = process.env.SECRET_KEY_QA ?? '';
  } else {
    secretKey = process.env.SECRET_KEY_CERT ?? '';
  }
  
  // Ensure secret key is provided
  if (!secretKey) {
    throw new Error(`SECRET_KEY_${env.toUpperCase()} is not defined in environment variables. Please check your .env file.`);
  }
  
  return {
    environment: env,
    secretKey: secretKey
  };
}

/**
 * Gets the secret key for the current environment
 * @returns Secret key string
 */
export function getSecretKey(): string {
  return getEnvironmentConfig().secretKey;
}

/**
 * Gets the current environment name
 * @returns Environment name (qa or cert)
 */
export function getEnvironmentName(): 'qa' | 'cert' {
  return getEnvironmentConfig().environment;
}
