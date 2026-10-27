import { t } from '../shared/i18n.ts';
import { sendMessage } from '../shared/messageClient.ts';
import { getSelectedText, getShortcut, isEditableTarget } from './shortcut.ts';
import { writeClipboard } from './clipboard.ts';
import { showToast } from './toast.ts';
import { getErrorMessage } from './errorMessage.ts';
import type { MessageErrorCode } from '../shared/type.d.ts';

const connectionFailureTitle = t('connectionFailed');

function showFailure(error: MessageErrorCode) {
  const message = getErrorMessage(error);
  if (message)
    showToast(
      error === 'MESSAGE_UNAVAILABLE'
        ? connectionFailureTitle
        : t('operationFailed'),
      message,
      'error',
    );
}

async function handleShortcut(
  action: 'select' | 'copy' | 'save',
  position: number,
  text: string,
) {
  if (action === 'select') {
    const response = await sendMessage({
      type: 'shortcut.list.select',
      position,
    });
    if (response.ok) showToast(t('listChanged'), response.data.listName);
    else showFailure(response.error);
    return;
  }
  const response =
    action === 'save'
      ? await sendMessage({ type: 'shortcut.command.set', position, text })
      : await sendMessage({ type: 'shortcut.command.get', position });
  if (!response.ok) {
    showFailure(response.error);
    return;
  }
  if (action === 'copy' && !(await writeClipboard(response.data.text))) {
    showToast(
      t('copyFailed'),
      t('clipboardHint'),
      'error',
    );
    return;
  }
  showToast(
    t(action === 'copy' ? 'snippetCopied' : 'snippetSaved', response.data.listName),
    response.data.text.replace(/\s+/g, ' ').trim().slice(0, 60),
  );
}

if (window.top === window && /^https?:$/.test(location.protocol)) {
  document.addEventListener('keydown', (event) => {
    if (!event.isTrusted) return;
    const shortcut = getShortcut(event);
    if (!shortcut) return;
    const editing = isEditableTarget(event);
    if (editing && shortcut.action !== 'save') return;
    const text = shortcut.action === 'save' ? getSelectedText() : '';
    if (shortcut.action === 'save' && !text.trim()) return;
    // 편집 중 저장 단축키가 선택한 원문을 기호로 바꾸지 않도록 즉시 막는다.
    if (editing) event.preventDefault();
    void handleShortcut(shortcut.action, shortcut.position, text);
  });
}
