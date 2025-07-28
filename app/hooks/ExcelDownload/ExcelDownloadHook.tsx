import type { ExcelDownloadColumn, ExcelDownloadWorkbook, ExcelDownloadWorksheet } from '@store/types/ExcelDownload';
import { getStringValue } from '@util/Format';
import Excel from 'exceljs';
import FileSaver from 'file-saver';
import { useCallback } from 'react';

type ExcelJsColumn = Partial<Excel.Column>;

/**
 * Generates and downloads an Excel spreadsheet that contains one or more worksheets.
 *
 * @example
 *
 * // Set column definitions (optional)
 *
 * const columns: Array<ExcelDownloadColumn<MyModel>> = [
 *   {
 *     key: 'id',
 *   },
 *   {
 *     key: 'firstName',
 *     label: 'First Name',
 *     width: 20, // Overrides defaultColumnWidth for this column
 *   },
 *   {
 *     key: 'lastName',
 *     label: 'Last Name',
 *     width: 'auto', // Overrides defaultColumnWidth for this column
 *     render: (lastName: string) => lastName.toUpperCase(),
 *   },
 *   {
 *     key: 'address',
 *     altKey: 'street1',
 *     label: 'Address Line 1',
 *     render: (address: Address) => address.street1,
 *   },
 * ];
 *
 * // Get custom hook
 *
 * const [downloadExcel] = useExcelDownload<MyModel>();
 *
 * // Call the "downloadExcel()" method from the custom hook as needed
 *
 * const handleDownload = useCallback(() => {
 *
 *   // Prepare workbook to pass to method from custom hook.
 *   // Be aware of worksheet naming restrictions.
 *   // https://support.microsoft.com/en-us/office/rename-a-worksheet-3f1f7148-ee83-404d-8ef0-9ff99fbad1f9
 *
 *   const workbook: ExcelDownloadWorkbook<MyModel> = {
 *     filename: 'my-excel-file',
 *     worksheets: [
 *       {
 *         list: myDataToConvert,
 *         worksheetName: 'My Worksheet', // optional
 *         columns: columns, // optional
 *         defaultColumnWidth: 'auto', // optional
 *       },
 *     ],
 *   };
 *
 *   // Call method from custom hook
 *   downloadExcel(workbook);
 *
 * }, [downloadExcel]);
 *
 * <Button onClick={handleDownload}>Download</Button>
 */
const useExcelDownload = <T extends object>() => {
  const styleHeaderRow = useCallback((ws: Excel.Worksheet) => {
    ws.getRow(1).font = {
      bold: true,
    };

    ws.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];
  }, []);

  const getKey = useCallback((column: ExcelDownloadColumn<T>) => {
    const { key, altKey } = column;
    return altKey ? `${key.toString()}_${altKey}` : key.toString();
  }, []);

  /**
   * Sets the column width if a custom value was provided, either for individual column or spreadsheet default
   */
  const setColumnWidth = useCallback(
    (worksheet: ExcelDownloadWorksheet<T>, currentColumn: ExcelJsColumn, columnDef?: ExcelDownloadColumn<T>) => {
      if (worksheet?.defaultColumnWidth || columnDef?.width) {
        // Set exact width
        if (columnDef?.width && Number(columnDef?.width)) {
          currentColumn.width = Number(columnDef.width);
        } else if (Number(worksheet.defaultColumnWidth)) {
          currentColumn.width = Number(worksheet.defaultColumnWidth);
        }

        // Set auto-fit width
        if (worksheet?.defaultColumnWidth === 'auto' || columnDef?.width === 'auto') {
          const initialSpacing = 10;

          currentColumn.width = worksheet.list.reduce((acc: number, currentValue: T) => {
            const labelLength = columnDef?.label?.length ?? 0;

            let cellValue;

            if (columnDef) {
              const key = columnDef.key as keyof T;

              cellValue = columnDef.render
                ? (columnDef.render(currentValue[key], currentValue) ?? '')
                : ((currentValue[key] as string) ?? '');
            } else {
              const key = currentColumn.key as keyof T;
              cellValue = (currentValue[key] as string) ?? '';
            }

            const cellValueLength = labelLength > cellValue.length ? labelLength : cellValue.length;

            return Math.max(acc, cellValueLength);
          }, initialSpacing);
        }
      }
    },
    []
  );

  /**
   * Gets a collection of default column objects if custom columns were not provided.
   * @returns [ { header: 'firstName', key: 'firstName' } ]
   */
  const getDefaultColumns = useCallback(
    (worksheet: ExcelDownloadWorksheet<T>) => {
      const columns: ExcelJsColumn[] = [];
      // Iterate over all keys in the first row of the list collection and build column collection
      for (const key in worksheet.list[0]) {
        if (worksheet.list[0].hasOwnProperty(key)) {
          const newColumn: ExcelJsColumn = { header: key, key: key };
          setColumnWidth(worksheet, newColumn);
          columns.push(newColumn);
        }
      }

      return columns;
    },
    [setColumnWidth]
  );

  /**
   * Gets a collection of custom column objects.
   * @returns [ { header: 'First Name', key: 'firstName', width: 10 } ]
   */
  const getCustomColumns = useCallback(
    (columns: ExcelDownloadColumn<T>[], worksheet: ExcelDownloadWorksheet<T>) => {
      return columns.map((columnDef: ExcelDownloadColumn<T>) => {
        const currentColumn: ExcelJsColumn = { key: getKey(columnDef) };

        // Set header label
        if (columnDef.label) {
          currentColumn.header = columnDef.label;
        }

        setColumnWidth(worksheet, currentColumn, columnDef);

        return currentColumn;
      });
    },
    [getKey, setColumnWidth]
  );

  /**
   * Gets a collection of rows with rendered cell content.
   * @returns [ { firstName: 'Foo', lastName: 'Bar' } ]
   */
  const getRows = useCallback(
    (worksheet: ExcelDownloadWorksheet<T>) => {
      return worksheet.list.map((row: T) => {
        const cells =
          worksheet?.columns?.map((column: ExcelDownloadColumn<T>) => {
            const { key, render } = column;
            const lKey = getKey(column);

            // Return custom object with rendered cell value either directly or via callback function
            return {
              [lKey]: render ? render(row[key], row) : getStringValue(row[key] as string),
            };
          }) ?? [];

        return cells.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      });
    },
    [getKey]
  );

  /**
   * Takes 'worksheets' argument and builds ExcelJS worksheets which are added to the workbook.
   */
  const buildWorksheets = useCallback(
    (wb: Excel.Workbook, worksheets: ExcelDownloadWorksheet<T>[]): void => {
      worksheets.forEach((worksheet: ExcelDownloadWorksheet<T>, index: number) => {
        const defaultSheetName = `Sheet${index + 1}`;
        const ws = wb.addWorksheet(worksheet.worksheetName ?? defaultSheetName, {});

        if (worksheet?.columns && worksheet.columns.length > 0) {
          ws.columns = getCustomColumns(worksheet.columns, worksheet);
          const rows = getRows(worksheet);
          ws.addRows(rows);
        } else {
          ws.columns = getDefaultColumns(worksheet);
          ws.addRows(worksheet.list);
        }

        styleHeaderRow(ws);
      });
    },
    [getCustomColumns, getDefaultColumns, getRows, styleHeaderRow]
  );

  /**
   * Creates and downloads an Excel spreadsheet.
   */
  const downloadExcel = useCallback(
    (workbook: ExcelDownloadWorkbook<T>): void => {
      if (!workbook) {
        throw new Error('Missing required argument [workbook].');
      }

      if (!workbook?.worksheets || workbook.worksheets.length === 0) {
        throw new Error('At least one worksheet is required.');
      }

      const wb = new Excel.Workbook();
      buildWorksheets(wb, workbook.worksheets);

      wb.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `${workbook.filename}.xlsx`);
      });
    },
    [buildWorksheets]
  );

  return [downloadExcel];
};

export default useExcelDownload;
