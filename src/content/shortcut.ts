export type Shortcut = {
  action: 'selectList' | 'selectCommand' | 'copy' | 'save';
  position: number;
};

export function getShortcut(
  event: KeyboardEvent,
  mac: boolean,
  leftAlt: boolean,
): Shortcut | undefined {
  const altGraph = event.getModifierState('AltGraph');
  if (
    event.defaultPrevented ||
    event.isComposing ||
    event.metaKey ||
    (altGraph && (mac || !leftAlt))
  )
    return;

  // Match the physical key even when a modifier changes the character.
  const digit = /^(?:Digit|Numpad)([0-9])$/.exec(event.code)?.[1];
  if (digit === undefined) return;
  const position = digit === '0' ? 10 : Number(digit);
  const { ctrlKey, altKey, shiftKey } = event;

  // Chrome on Windows can report Ctrl+left Alt as AltGraph on some layouts.
  if (altGraph)
    return shiftKey ? undefined : { action: 'selectCommand', position };

  if (ctrlKey && shiftKey && !altKey) return { action: 'selectList', position };
  if (ctrlKey && altKey && !shiftKey && (mac || leftAlt))
    return { action: 'selectCommand', position };
  // Leave Windows Alt codes available on the numeric keypad.
  if (
    !shiftKey &&
    (mac
      ? ctrlKey && !altKey
      : leftAlt && altKey && !ctrlKey && event.code.startsWith('Digit'))
  )
    return { action: 'copy', position };
  if (!ctrlKey && shiftKey && altKey) return { action: 'save', position };
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
