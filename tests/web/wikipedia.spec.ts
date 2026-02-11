import { test, expect } from '../../fixtures/custom-fixtures';
import { WikipediaPage } from '../../pages/wikipedia.page';
import { validateImageExtension, getFileSize } from '../../utils/file-validator';
import { getTestDataPath, readExcelData } from '../../utils/excel-reader';
import * as path from 'path';

// Read test data from Excel file
const testData = readExcelData(getTestDataPath());

test.describe('Wikipedia Pokemon Tests', () => {
  testData.forEach(({ name }) => {
    test(`Validate Wikipedia page for ${name}`, async ({ page, logTest }) => {
      // Initialize Wikipedia Page Object
      const wikiPage = new WikipediaPage(page);

      // Step 3: Navigate to Pokemon Wikipedia page
      await wikiPage.goto(name);

      // Step 4: Validate page title
      const pageTitle = await wikiPage.getPageTitle();
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.toLowerCase()).toContain(name.toLowerCase());
      console.log(`Page title: ${pageTitle}`);

      // Step 5: Get and log the artwork designer
      const designer = await wikiPage.getArtworkDesigner();
      console.log(`Artwork designer for ${name}: ${designer}`);

      // Step 6: Download the main Pokemon image
      const imagePath = path.join(process.cwd(), 'images', `${name}.png`);
      const downloadedPath = await wikiPage.downloadMainImage(imagePath);
      
      console.log(`Image downloaded to: ${downloadedPath}`);

      // Step 7a: Validate image extension (case insensitive)
      const hasValidExtension = validateImageExtension(downloadedPath);
      expect(hasValidExtension).toBe(true);
      console.log(`Image extension is valid: ${path.extname(downloadedPath)}`);

      // Step 7b: Validate file size is less than 500000 bytes
      const fileSize = getFileSize(downloadedPath);
      expect(fileSize).toBeLessThan(500000);
      console.log(`Image file size: ${fileSize} bytes (< 500000 bytes)`);

      // Step 8: Log test end time
      logTest.end();
    });
  });
});
