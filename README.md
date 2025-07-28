# Example implementation of excelJS using a custom React hook

[excelJS](https://github.com/exceljs/exceljs) is a popular library for generating spreadsheets.

This example project uses a customizable React hook to implement the creation of spreadsheets using excelJS.

## Running the Project

```bash
npm install
npm run dev
```

## Implementation

```typescript
// Set column definitions (optional)
const columns: Array<ExcelDownloadColumn<MyModel>> = [
  {
    key: "id",
  },
  {
    key: "firstName",
    label: "First Name",
    width: 20, // Overrides defaultColumnWidth for this column
  },
  {
    key: "lastName",
    label: "Last Name",
    width: "auto", // Overrides defaultColumnWidth for this column
    render: (lastName: string) => lastName.toUpperCase(),
  },
  {
    key: "address",
    altKey: "street1",
    label: "Address Line 1",
    render: (address: Address) => address.street1,
  },
];

// Get custom hook

const [downloadExcel] = useExcelDownload<MyModel>();

// Call the "downloadExcel()" method from the custom hook as needed

const handleDownload = useCallback(() => {
  // Prepare workbook to pass to method from custom hook.
  // Be aware of worksheet naming restrictions.
  // https://support.microsoft.com/en-us/office/rename-a-worksheet-3f1f7148-ee83-404d-8ef0-9ff99fbad1f9

  const workbook: ExcelDownloadWorkbook<MyModel> = {
    filename: "my-excel-file",
    worksheets: [
      {
        list: myDataToConvert,
        worksheetName: "My Worksheet", // optional
        columns: columns, // optional
        defaultColumnWidth: "auto", // optional
      },
    ],
  };

  // Call method from custom hook
  downloadExcel(workbook);
}, [downloadExcel]);
```

```html
<button onClick="{handleDownload}">Download</button>
```
