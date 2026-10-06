export type Shortcut = { action: 'select' | 'copy' | 'save'; position: number };

export function isEditableTarget(event: KeyboardEvent): boolean {
  return event.composedPath().some(
    (target) =>
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable),
  );
}

export function getShortcut(event: KeyboardEvent): Shortcut | undefined {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.isComposing ||
    event.ctrlKey ||
    event.metaKey ||
    event.getModifierState('AltGraph')
  )
    return;
  if (!event.shiftKey && !event.altKey) return;
  // Shift/Option은 event.key를 기호로 바꾸므로 물리 숫자 키를 기준으로 한다.
  const digit = /^(?:Digit|Numpad)([0-9])$/.exec(event.code)?.[1];
  if (digit === undefined) return;
  return {
    action: event.altKey ? (event.shiftKey ? 'save' : 'copy') : 'select',
    position: digit === '0' ? 10 : Number(digit),
  };
}

export function getSelectedText(): string {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement)
    active = active.shadowRoot.activeElement;
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement
  ) {
    // 비밀번호 등 선택 범위를 제공하지 않는 필드는 읽지 않는다.
    if (active instanceof HTMLInputElement && active.type === 'password')
      return '';
    const { selectionStart, selectionEnd } = active;
    return selectionStart === null || selectionEnd === null
      ? ''
      : active.value.slice(selectionStart, selectionEnd);
  }
  return window.getSelection()?.toString() ?? '';
}
