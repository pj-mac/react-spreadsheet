import { format } from 'date-fns';

export const EMPTY_STRING_VALUE = '-';
export const STRING_DATE_FORMAT = 'MM/dd/yyyy';

export const getFormattedDate = (date: string, dateFormat?: string): string => {
  return format(date, dateFormat || STRING_DATE_FORMAT);
};

export const getStringValue = (value?: string, dateStringFormat: boolean | string = false): string => {
  return value
    ? dateStringFormat
      ? getFormattedDate(value, typeof dateStringFormat === 'string' ? dateStringFormat : undefined)
      : value
    : EMPTY_STRING_VALUE;
};
