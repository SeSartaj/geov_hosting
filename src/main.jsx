import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App
      // requestHeaders={{
      //   Authorization:
      //     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4NzUyMDk3LCJqdGkiOiJlNjc4MmM5Yjc5ZTc0NDY2YTZmNmU2ZDM1N2E2ODllMSIsInVzZXJfaWQiOjgzOTN9.dFNZ2-zgwUZx-QhmTwLsBLUrIDmHvP-d_sPneZw3W-s',
      // }}
      configs={{
        VITE_MAPTILER_ACCESS_KEY: 'nffTPMlX5bMIm8VR0LFb',
        VITE_SENTINAL_HUB_CLIENT_ID: '9188261d-b9c9-48a3-b1b4-b4653da6a8f0',
        VITE_SENTINAL_HUB_CLIENT_SECRET: 'sln8tqts90EhECu4t1YhnfpEaCSr88ax',
        VITE_SENTINAL_HUB_WMTS_ID: '5d381ab5-75f9-4fa0-8324-4635bfdbb664',
      }}
    />
  </React.StrictMode>
);
