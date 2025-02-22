import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from 'json2csv';
import { Transform } from 'stream';

const date = new Date().toISOString().replace(/:/g, '-');
interface CustomParseOptions {
  fields?: string[];
  delimiter?: string;
  quote?: string;
  filename?: string | `download.csv`;
}

export class FileDownloadService {
  /**
   * Generate CSV from JSON data
   * @param data Array of objects to convert to CSV
   * @param options Configuration options for CSV generation
   * @returns Generated CSV string
   */
  generateCSV(
    data: any[], 
    options?: CustomParseOptions
  ): string {
    // Validate input
    if (!data || data.length === 0) {
      throw new Error('No data provided for CSV generation');
    }

    // Use provided fields or extract from first object
    const defaultFields = Object.keys(data[0]);
    
    const parserOptions = {
      fields: options?.fields || defaultFields,
      delimiter: options?.delimiter || ',',
      quote: options?.quote || '"'
    };

    try {
      const parser = new Parser(parserOptions);
      const csv = parser.parse(data);
      
      // Optional: Save to file (with error handling)
      const filename = options?.filename || new Date()+'download.csv';
      const fullPath = path.join(process.cwd(), 'downloads', filename);
      
      // Ensure downloads directory exists
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      
      fs.writeFileSync(fullPath, csv);
      
      return csv;
    } catch (error) {
      console.error('CSV Generation Error:', error);
      throw new Error(`Failed to generate CSV: ${error}`);
    }
  }

  /**
   * Direct download method for Express
   * @param res Express response object
   * @param data Data to convert to CSV
   * @param filename Name of the downloaded file
   */
  downloadCSV(
    res: Response, 
    data: any[], 
    filename = `Card-Request${Date.now()}.csv`
  ): void {
    try {
      const csv = this.generateCSV(data, { filename });
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      
      // Send CSV content
      res.status(200).send(csv);
    } catch (error) {
      // Handle errors
      console.error('CSV Download Error:', error);
      res.status(500).json({
        message: 'Failed to generate CSV',
        error: error
      });
    }
  }

  /**
   * Stream large CSV files to avoid memory issues
   * @param res Express response object
   * @param data Large dataset
   * @param filename Name of the downloaded file
   */
  streamCSV(
    res: Response, 
    data: any[], 
    filename = 'download.csv'
  ): void {
    try {
      const parser = new Parser();
      
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      
      // Create a transform stream
      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          const csv = parser.parse(chunk);
          callback(null, csv);
        }
      });

      // Pipe the data to the transform stream
      data.forEach(item => transformStream.write(item));
      transformStream.end();
      
      // Pipe the transform stream to the response
      transformStream.pipe(res);
    } catch (error) {
      console.error('CSV Streaming Error:', error);
      res.status(500).json({
        message: 'Failed to stream CSV',
        error: error
      });
    }
  }
}

// Export as singleton
export const fileDownloadService = new FileDownloadService();
