import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import * as fs from 'fs';
import * as path from 'path';
import { ensureDirectoryExists } from '../utils/file-validator';

/**
 * Wikipedia Page Object for Pokemon pages
 */
export class WikipediaPage extends BasePage {
  // Selectors
  private readonly pageHeading = '#firstHeading';
  private readonly infoboxTable = 'table.infobox';
  private readonly infoboxImage = 'table.infobox img.mw-file-element';
  private readonly designedByRow = 'table.infobox tr:has-text("Designed by")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to a Pokemon's Wikipedia page
   * @param pokemonName - Name of the Pokemon
   */
  async goto(pokemonName: string): Promise<void> {
    const url = `https://en.wikipedia.org/wiki/${pokemonName}`;
    await super.goto(url);
    await this.waitForLoad();
  }

  /**
   * Gets the page title/heading
   * @returns The main heading text
   */
  async getPageTitle(): Promise<string> {
    try {
      const heading = await this.page.locator(this.pageHeading).textContent();
      return heading?.trim() || '';
    } catch (error) {
      throw new Error(`Failed to get page title: ${error}`);
    }
  }

  /**
   * Gets the name of the artwork designer from the infobox
   * @returns The designer's name
   */
  async getArtworkDesigner(): Promise<string> {
    try {
        const captionElement = this.page.locator('.infobox-caption').first();
        if (await captionElement.count() > 0) {
          const captionText = await captionElement.innerText();
          // Extract designer name from caption like "Pikachu artwork by Ken Sugimori"
          const artworkByMatch = captionText.match(/artwork by\s+(.+?)(?:\[|$)/i);
          if (artworkByMatch && artworkByMatch[1]) {
            return this.cleanDesignerText(artworkByMatch[1]);
          }
        }
      return 'Designer not found';
    } catch (error) {
      throw new Error(`Failed to get artwork designer: ${error}`);
    }
  }

  /**
   * Cleans designer text by removing CSS, special characters, and formatting
   * @param text - Raw text from Wikipedia
   * @returns Cleaned designer name(s)
   */
  private cleanDesignerText(text: string): string {
    if (!text) return '';
    
    // Remove CSS class definitions (like .mw-parser-output)
    let cleaned = text.replace(/\.mw-[a-z-]+\s+[^}]+\}/gi, '');
    
    // Remove any remaining CSS-like content
    cleaned = cleaned.replace(/\{[^}]*\}/g, '');
    
    // Remove reference brackets like [1], [2], etc.
    cleaned = cleaned.replace(/\[\d+\]/g, '');
    
    // Remove extra whitespace and newlines
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }

  /**
   * Downloads the main Pokemon image from the page
   * Interacts with page elements rather than using direct URL
   * @param savePath - Path where to save the image
   * @returns Path to the downloaded image
   */
  async downloadMainImage(savePath: string): Promise<string> {
    try {
      // Ensure the directory exists
      const dir = path.dirname(savePath);
      ensureDirectoryExists(dir);

      // Get the main image from infobox
      const imageElement = this.page.locator(this.infoboxImage).first();
      await imageElement.waitFor({ state: 'visible', timeout: 10000 });

      // Get the image source URL
      const imageSrc = await imageElement.getAttribute('src');
      
      if (!imageSrc) {
        throw new Error('Could not find image source');
      }

      // Make the URL absolute if it's relative
      let imageUrl = imageSrc;
      if (imageSrc.startsWith('//')) {
        imageUrl = 'https:' + imageSrc;
      } else if (imageSrc.startsWith('/')) {
        imageUrl = 'https://en.wikipedia.org' + imageSrc;
      }

      // Use Playwright's request context to download the image
      const response = await this.page.request.get(imageUrl);
      
      if (!response.ok()) {
        throw new Error(`Failed to download image: ${response.status()}`);
      }

      const buffer = await response.body();
      
      // Write the file
      fs.writeFileSync(savePath, buffer);

      return savePath;
    } catch (error) {
      throw new Error(`Failed to download main image: ${error}`);
    }
  }
}
