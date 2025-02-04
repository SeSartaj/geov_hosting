import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App
      requestHeaders={{
        Authorization:
          'Bearer  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Njg1NDgyLCJqdGkiOiJmY2NjNzViYmU1Mjc0NTU1YWU0YTEyN2MyOWY5ZGIzYSIsInVzZXJfaWQiOjgzOTN9.wwjGDFVGpjCSr79UnP38z2nJTQr2Hge6LxzkB9dW_78',
      }}
    />
  </React.StrictMode>,
  document.getElementById('root')
);
