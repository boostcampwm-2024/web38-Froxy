import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './query';
import { RouteProvider } from './router';

import './style/index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <QueryProvider>
      <RouteProvider />
    </QueryProvider>
  </StrictMode>
);
