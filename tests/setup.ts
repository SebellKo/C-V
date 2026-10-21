import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// dnd-kit constructs an observer during import, before beforeEach runs.
vi.stubGlobal('ResizeObserver', ResizeObserverStub);
HTMLElement.prototype.scrollIntoView ??= () => {};

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal('matchMedia', vi.fn((media: string) => ({
    matches: false, media, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => true,
  })));
  if (!globalThis.PointerEvent) vi.stubGlobal('PointerEvent', MouseEvent);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
