import Fuse from 'fuse.js';
import fs from 'fs';
import csv from 'csv-parser';

export const getHsnDescription = async (stringToSearch: string) => {
  return new Promise((resolve, reject) => {
    // Array to store CSV data
    const gstData: any[] = [];

    // Read and parse CSV file
    fs.createReadStream('src/main/utils/hsncode.csv')
      .pipe(csv())
      .on('data', (row: any) => {
        gstData.push(row);
      })
      .on('end', () => {
        try {
          // Configure Fuse options
          const fuseOptions = {
            isCaseSensitive: false,
            includeScore: true,
            shouldSort: true,
            includeMatches: true,
            findAllMatches: false,
            minMatchCharLength: 2,
            threshold: 0.3,
            distance: 100,
            useExtendedSearch: false,
            ignoreLocation: false,
            keys: ['HSN_CD'],
          };

          // Initialize Fuse with the data
          const fuse = new Fuse(gstData, fuseOptions);

          // Perform search and get only first result
          const searchResults = fuse.search(stringToSearch);
          const results = searchResults.length > 0 ? [searchResults[0]] : [];

          // Resolve with single result
          resolve({ results });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export async function getGstData(stringToSearch: string) {
  const result: any = await getHsnDescription(stringToSearch);

  const { HSN_Description } = result?.results[0]?.item || {};

  return new Promise((resolve, reject) => {
    // Array to store CSV data
    const gstData: any[] = [];

    // Read and parse CSV file
    fs.createReadStream('src/main/utils/gstData.csv')
      .pipe(csv())
      .on('data', (row: any) => {
        gstData.push(row);
      })
      .on('end', () => {
        try {
          // Configure Fuse options
          const fuseOptions = {
            isCaseSensitive: false,
            includeScore: true,
            shouldSort: true,
            includeMatches: true,
            findAllMatches: false,
            minMatchCharLength: 2,
            threshold: 0.3,
            distance: 100,
            useExtendedSearch: false,
            ignoreLocation: false,
            keys: ['HSN_Code', 'Description of Goods'],
          };

          // Initialize Fuse with the data
          const fuse = new Fuse(gstData, fuseOptions);

          // Perform search
          const results = fuse.search(HSN_Description);

          const {
            'CGST Rate\r\n\r\n  (%)': cgstRate,
            'SGST / UTGST\r\n\r\n  Rate (%)': sgstRate,
            'IGST Rate\r\n\r\n  (%)': igstRate,
          } = results?.[0]?.item || {};

          // Resolve with results
          resolve({ cgstRate, sgstRate, igstRate, results });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
