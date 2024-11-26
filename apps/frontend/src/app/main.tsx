import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './query';
import { RouteProvider } from './router';

import './style/index.css';
import { OverlayProvider } from '@/shared/overlay';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mock/browser');

  return worker.start({
    onUnhandledRequest: (request, print) => {
      if (!request.url.includes('/api/')) return;
      print.warning();
    }
  });
}
enableMocking();

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <QueryProvider>
      <OverlayProvider>
        <RouteProvider />
      </OverlayProvider>
    </QueryProvider>
  </StrictMode>
);
