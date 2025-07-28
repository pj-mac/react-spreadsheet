import React from 'react';
import Spreadsheet from 'Spreadsheet';

export function meta() {
  return [
    { title: 'Download Spreadsheet' },
    {
      name: 'description',
      content:
        'This example project uses a customizable React hook to implement the creation of spreadsheets using excelJS.',
    },
  ];
}

const Home: React.FunctionComponent = () => <Spreadsheet />;

export default Home;
