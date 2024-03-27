import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './Chart';
import { DataProvider } from './utils/DataAPI';

ReactDOM.render(
  <DataProvider>
    <Chart />
  </DataProvider>,
  document.getElementById('root')
);