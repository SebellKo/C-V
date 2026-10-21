import { describe, expect, it, vi } from 'vitest';
import { getSelectedText, getShortcut } from '../src/content/shortcut.ts';
import { writeClipboard } from '../src/content/clipboard.ts';
import { showToast } from '../src/content/toast.ts';

describe('webpage shortcuts and clipboard', () => {
  it('maps physical digits and modifiers while ignoring composition, repeats and reserved modifiers', () => {
    expect(getShortcut(new KeyboardEvent('keydown', { code: 'Digit0', shiftKey: true }))).toEqual({ action: 'select', position: 10 });
    expect(getShortcut(new KeyboardEvent('keydown', { code: 'Digit2', altKey: true }))).toEqual({ action: 'copy', position: 2 });
    expect(getShortcut(new KeyboardEvent('keydown', { code: 'Digit2', altKey: true, shiftKey: true }))).toEqual({ action: 'save', position: 2 });
    for (const options of [{ ctrlKey: true }, { metaKey: true }, { isComposing: true }, { repeat: true }]) {
      expect(getShortcut(new KeyboardEvent('keydown', { code: 'Digit1', altKey: true, ...options }))).toBeUndefined();
    }
  });

  it('reads only the current selection and refuses password input', () => {
    const textarea = document.createElement('textarea');
    textarea.value = '  인사\n감사  ';
    document.body.append(textarea);
    textarea.focus();textarea.setSelectionRange(2, 7);
    expect(getSelectedText()).toBe('인사\n감사');
    const password = document.createElement('input');password.type = 'password';password.value = 'secret';
    document.body.append(password);password.focus();
    expect(getSelectedText()).toBe('');
    textarea.remove();password.remove();
  });

  it('writes original text without reading clipboard and returns failure when denied', async () => {
    const text = '  첫 줄\n둘째 줄  ';
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(document, 'hasFocus').mockReturnValue(true);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    expect(await writeClipboard(text)).toBe(true);
    expect(writeText).toHaveBeenCalledWith(text);
    writeText.mockRejectedValueOnce(new Error('denied'));
    expect(await writeClipboard(text)).toBe(false);
    vi.spyOn(document, 'hasFocus').mockReturnValue(false);
    expect(await writeClipboard(text)).toBe(false);
    expect(writeText).toHaveBeenCalledTimes(2);
  });
});

describe('isolated toast lifetime', () => {
  it('renders user text safely in a closed live region and replaces timers without removing the new toast', () => {
    vi.useFakeTimers();
    const original = Element.prototype.attachShadow;
    const roots: ShadowRoot[] = [];
    vi.spyOn(Element.prototype, 'attachShadow').mockImplementation(function(this: Element, init) {
      const root = original.call(this, init);roots.push(root);return root;
    });
    showToast('C:V에 연결하지 못했습니다.', '페이지를 새로고침 해주세요.', 'error');
    vi.advanceTimersByTime(16);
    const first = document.querySelector('cv-toast');
    expect(first?.shadowRoot).toBeNull();
    expect(roots[0]?.querySelector('[role="status"]')).toHaveAttribute('aria-live', 'polite');
    expect(roots[0]?.textContent).toContain('페이지를 새로고침 해주세요.');
    vi.advanceTimersByTime(3984);
    expect(first?.isConnected).toBe(true);
    showToast('메일 · 복사됨', '<img src=x onerror=alert(1)>');
    vi.advanceTimersByTime(16);
    const second = document.querySelector('cv-toast');
    expect(first?.isConnected).toBe(false);
    expect(roots[1]?.querySelector('img')).toBeNull();
    expect(roots[1]?.querySelector('p')?.textContent).toBe('<img src=x onerror=alert(1)>');
    vi.advanceTimersByTime(984);
    expect(second?.isConnected).toBe(true);
    vi.advanceTimersByTime(500);
    expect(document.querySelector('cv-toast')).toBeNull();
  });
});
