import { test, expect } from '../../fixtures/custom-fixtures';
import { getTestDataPath, readExcelData } from '../../utils/excel-reader';

// Read test data from Excel file
const testData = readExcelData(getTestDataPath());

test.describe('Pokemon API Tests - Part 1', () => {
  // Tests by ID
  testData.forEach(({ id, name }) => {
    test(`Validate Pokemon by ID: ${id} (${name})`, async ({ request, logTest }) => {
      // Record start time for response time validation
      const startTime = Date.now();
      
      // Make API request
      const response = await request.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Assertions
      expect(response.status()).toBe(200);
      
      // Validate response time is less than 10 seconds (10000 ms)
      expect(responseTime).toBeLessThan(10000);
      
      // Parse response data
      const data = await response.json();
      
      // Validate id
      expect(data.id).toBe(id);
      
      // Validate name
      expect(data.name).toBeTruthy();
      expect(data.name).toBe(name.toLowerCase());
      
      // Validate abilities
      expect(data.abilities).toBeTruthy();
      expect(Array.isArray(data.abilities)).toBe(true);
      expect(data.abilities.length).toBeGreaterThan(0);
      
      // Validate abilities structure
      data.abilities.forEach((ability: any) => {
        expect(ability).toHaveProperty('ability');
        expect(ability.ability).toHaveProperty('name');
        expect(ability.ability.name).toBeTruthy();
      });
      
      // Log response time for debugging
      console.log(`Response time for Pokemon ID ${id}: ${responseTime}ms`);
      
      // Log test end time
      logTest.end();
    });
  });

  // Tests by name
  testData.forEach(({ id, name }) => {
    test(`Validate Pokemon by name: ${name}`, async ({ request, logTest }) => {
      // Record start time for response time validation
      const startTime = Date.now();
      
      // Make API request using name (lowercase)
      const response = await request.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Assertions
      expect(response.status()).toBe(200);
      
      // Validate response time is less than 10 seconds (10000 ms)
      expect(responseTime).toBeLessThan(10000);
      
      // Parse response data
      const data = await response.json();
      
      // Validate id
      expect(data.id).toBe(id);
      
      // Validate name
      expect(data.name).toBeTruthy();
      expect(data.name).toBe(name.toLowerCase());
      
      // Validate abilities
      expect(data.abilities).toBeTruthy();
      expect(Array.isArray(data.abilities)).toBe(true);
      expect(data.abilities.length).toBeGreaterThan(0);
      
      // Validate abilities structure
      data.abilities.forEach((ability: any) => {
        expect(ability).toHaveProperty('ability');
        expect(ability.ability).toHaveProperty('name');
        expect(ability.ability.name).toBeTruthy();
      });
      
      // Log response time for debugging
      console.log(`Response time for Pokemon ${name}: ${responseTime}ms`);
      
      // Log test end time
      logTest.end();
    });
  });
});
