export async function writeClipboard(text: string): Promise<boolean> {
  if (!document.hasFocus()) return false;
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // 일반 HTTP 페이지에는 Clipboard API가 없다. 쓰기 이벤트만 사용하며
    // 임시 입력 요소나 focus 변경 없이 현재 페이지의 선택 영역을 보존한다.
    let written = false;
    const onCopy = (event: ClipboardEvent) => {
      if (!event.clipboardData) return;
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
      event.stopImmediatePropagation();
      written = true;
    };
    window.addEventListener('copy', onCopy, true);
    try {
      return document.execCommand('copy') && written;
    } finally {
      window.removeEventListener('copy', onCopy, true);
    }
  } catch {
    return false;
  }
}
