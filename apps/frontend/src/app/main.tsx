import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouteProvider } from './router/RouteProvider';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouteProvider />
  </StrictMode>
);
