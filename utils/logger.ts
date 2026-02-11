/**
 * Logger utility for test execution
 */
export class Logger {
  private testName: string;
  private startTime: Date;

  constructor(testName: string = '') {
    this.testName = testName;
    this.startTime = new Date();
  }

  /**
   * Logs the end of a test with timestamp
   */
  end(): void {
    const endTime = new Date();
    const formattedTime = this.formatDateTime(endTime);
    console.log(`Test finished at: ${formattedTime}`);
  }

  /**
   * Logs a custom message with timestamp
   * @param message - Message to log
   */
  log(message: string): void {
    const timestamp = this.formatDateTime(new Date());
    console.log(`[${timestamp}] ${message}`);
  }

  /**
   * Logs the encrypted key
   * @param encryptedKey - The encrypted secret key
   */
  logEncryptedKey(encryptedKey: string): void {
    console.log(`Encrypted Secret Key: ${encryptedKey}`);
  }

  /**
   * Formats a date to YYYY-MM-DD HH:mm:ss format
   * @param date - Date to format
   * @returns Formatted date string
   */
  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

/**
 * Creates a new logger instance
 * @param testName - Optional test name
 * @returns Logger instance
 */
export function createLogger(testName?: string): Logger {
  return new Logger(testName);
}
