import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Copy } from 'lucide-react';

import './style.css';

function Popup() {
  return (
    <main className="grid size-full place-items-center bg-background p-[var(--spacing-6)] text-foreground">
      <section
        aria-labelledby="popup-ready-title"
        className="grid max-w-[calc(var(--popup-width)-var(--spacing-6)*2)] justify-items-center gap-[var(--spacing-3)] text-center"
      >
        <span className="grid size-[var(--control-height-lg)] place-items-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
          <Copy aria-hidden="true" size={16} strokeWidth={1.8} />
        </span>
        <div className="grid gap-[var(--spacing-1)]">
          <p className="text-label font-[var(--font-weight-medium)] text-accent-foreground">
            Popup 기반 구성 완료
          </p>
          <h1
            id="popup-ready-title"
            className="text-title font-[var(--font-weight-semibold)]"
          >
            React 기반이 준비되었습니다
          </h1>
          <p className="text-body text-muted-foreground">
            기능과 저장 데이터는 다음 단계에서 연결합니다.
          </p>
        </div>
      </section>
    </main>
  );
}

const rootElement = document.querySelector<HTMLDivElement>('#root');

if (!rootElement) {
  throw new Error('Popup root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
