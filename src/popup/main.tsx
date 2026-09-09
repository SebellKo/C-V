import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup } from './Popup.tsx';
import './style.css';

const rootElement = document.querySelector<HTMLDivElement>('#root');

if (!rootElement) {
  throw new Error('Popup root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
