import * as fs from 'fs';
import * as path from 'path';

/**
 * Validates if a file has a valid image extension
 * @param filename - The filename to validate
 * @returns true if the extension is valid (.jpg, .jpeg, .png, .svg), false otherwise
 */
export function validateImageExtension(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
  const ext = path.extname(filename).toLowerCase();
  return validExtensions.includes(ext);
}

/**
 * Validates if a file size is below the maximum allowed bytes
 * @param filepath - Path to the file
 * @param maxBytes - Maximum allowed file size in bytes
 * @returns true if file size is below maxBytes, false otherwise
 */
export function validateFileSize(filepath: string, maxBytes: number): boolean {
  try {
    const stats = fs.statSync(filepath);
    return stats.size < maxBytes;
  } catch (error) {
    throw new Error(`Failed to validate file size: ${error}`);
  }
}

/**
 * Gets the file size in bytes
 * @param filepath - Path to the file
 * @returns File size in bytes
 */
export function getFileSize(filepath: string): number {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (error) {
    throw new Error(`Failed to get file size: ${error}`);
  }
}

/**
 * Ensures a directory exists, creates it if it doesn't
 * @param dirPath - Path to the directory
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
