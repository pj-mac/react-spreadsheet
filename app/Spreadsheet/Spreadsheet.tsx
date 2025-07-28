import ContactInfoService from '@api/ContactInfoService';
import useExcelDownload from '@hooks/ExcelDownload';
import { Button } from '@mui/material';
import type { Address, ContactInfo } from '@store/types/ContactInfo';
import type { ExcelDownloadColumn, ExcelDownloadWorkbook } from '@store/types/ExcelDownload';
import { getFormattedDate } from '@util/Format';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';

const contactInfoColumns: Array<ExcelDownloadColumn<ContactInfo>> = [
  {
    key: 'firstName',
    label: 'First Name',
  },
  {
    key: 'lastName',
    label: 'Last Name',
  },
  {
    key: 'age',
    label: 'Age',
    render: (age: number | undefined) => (age !== undefined ? age.toString() : 'N/A'),
  },
  {
    key: 'hireDate',
    label: 'Hire Date',
    render: (hireDate: string) => getFormattedDate(hireDate, 'MM/dd/yyyy'),
  },
  {
    key: 'address',
    altKey: 'street1',
    label: 'Address Line 1',
    render: (address: Address) => address.street1,
  },
  {
    key: 'address',
    altKey: 'street2',
    label: 'Address Line 2',
    width: 100,
    render: (address: Address) => address?.street2 ?? '',
  },
  {
    key: 'address',
    altKey: 'city',
    label: 'City',
    render: (address: Address) => address.city,
  },
  {
    key: 'address',
    altKey: 'state',
    label: 'State',
    render: (address: Address) => address?.state ?? '',
  },
  {
    key: 'address',
    altKey: 'country',
    label: 'Country',
    render: (address: Address) => address.country,
  },
];

const Spreadsheet: React.FunctionComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [downloadExcel] = useExcelDownload<ContactInfo>();

  const handleDownloadClick = useCallback(() => {
    setFileLoading(true);

    ContactInfoService.getContactInfo()
      .then((contactInfoList: ContactInfo[]) => {
        const workbook: ExcelDownloadWorkbook<ContactInfo> = {
          filename: 'contact-info',
          worksheets: [
            {
              list: contactInfoList,
              worksheetName: 'Contact Info',
              columns: contactInfoColumns,
              defaultColumnWidth: 'auto',
            },
          ],
        };

        downloadExcel(workbook);

        setFileLoading(false);

        enqueueSnackbar('File downloaded!', {
          variant: 'success',
        });
      })
      .catch((errorMessage: string) => {
        enqueueSnackbar(`An error occurred: ${errorMessage}`, {
          variant: 'error',
        });
        setFileLoading(false);
      });
  }, [downloadExcel, enqueueSnackbar]);

  return (
    <main>
      <div className={'m-4'}>
        <Button onClick={handleDownloadClick} variant={'contained'} disabled={fileLoading}>
          CLICK TO DOWNLOAD CONTACT INFO
        </Button>
      </div>
    </main>
  );
};

export default Spreadsheet;
