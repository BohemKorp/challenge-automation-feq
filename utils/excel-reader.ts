import * as XLSX from 'xlsx';
import * as path from 'path';

export interface PokemonData {
  id: number;
  name: string;
}

/**
 * Reads Pokemon data from Excel file
 * @param filePath - Path to the Excel file
 * @returns Array of Pokemon data without header row
 */
export function readExcelData(filePath: string): PokemonData[] {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON with header: 1 to get raw arrays
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Remove header row (first row) and map to PokemonData
    return data.slice(1)
      .filter(row => row.length >= 2 && row[0] && row[1]) // Filter out empty rows
      .map(row => ({
        id: Number(row[0]),
        name: String(row[1]).trim()
      }));
  } catch (error) {
    throw new Error(`Failed to read Excel file: ${error}`);
  }
}

/**
 * Gets the path to the test data Excel file
 * @returns Absolute path to the Excel file
 */
export function getTestDataPath(): string {
  return path.join(process.cwd(), 'data', 'Datos-pruebas.xlsx');
}
