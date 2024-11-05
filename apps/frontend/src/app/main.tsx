import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouteProvider } from './router/RouteProvider';

import './style/index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouteProvider />
  </StrictMode>
);
