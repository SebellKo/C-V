import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { t } from '../shared/i18n.ts';
import { Popup } from './Popup.tsx';
import '../styles/popup.css';

const rootElement = document.querySelector<HTMLDivElement>('#root');

if (!rootElement) {
  throw new Error('Popup root element not found');
}

document.documentElement.lang = t('language');

createRoot(rootElement).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
