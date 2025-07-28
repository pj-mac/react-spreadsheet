export interface ExcelDownloadColumn<T = unknown> {
  // Property name
  key: keyof T;

  // Key of optional nested property. Required when using nested properties. (e.g., street1 of address)
  altKey?: string;

  // Optional column header name, defaulting to value of key if undefined
  label?: string;

  // Optional column width: exact or auto-fit
  width?: number | 'auto';

  // Optional callback function for rendering cell content, useful for custom formatting and handling nested fields
  render?: (value: any, record: T) => string;
}

export interface ExcelDownloadWorksheet<T> {
  // Array of worksheet content
  list: T[];

  // Optional name of worksheet
  // Be aware of worksheet naming restrictions.
  // https://support.microsoft.com/en-us/office/rename-a-worksheet-3f1f7148-ee83-404d-8ef0-9ff99fbad1f9
  worksheetName?: string;

  // Optional column definitions
  columns?: ExcelDownloadColumn<T>[];

  // Optional default width for all columns. Overwridden by specific column widths specified in 'columns'.
  defaultColumnWidth?: number | 'auto';
}

export interface ExcelDownloadWorkbook<T> {
  // Filename of spreadsheet, excluding file extension
  filename: string;

  // Array of worksheets
  worksheets: ExcelDownloadWorksheet<T>[];
}
