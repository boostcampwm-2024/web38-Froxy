import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Markdown } from './Markdown';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <div
      style={{
        margin: '0 auto',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '90vw',
        height: '90vh',
        padding: '1rem'
      }}
    >
      <Markdown
        markdown={'# Hello, world!\n\nThis is a markdown document.\n\n ```js\n const a = 1;\n console.log(a)\n ```'}
      />
    </div>
  </StrictMode>
);
