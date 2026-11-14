import { t } from '../shared/i18n.ts';
import { sendMessage } from '../shared/messageClient.ts';
import { writeClipboard } from './clipboard.ts';
import { getSelectedText, getShortcut } from './shortcut.ts';
import { showToast } from './toast.ts';
import { getErrorMessage } from './errorMessage.ts';
import type { Shortcut } from './shortcut.ts';
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

// shortcut: each page keeps its own copy source until reload. Share it if a cross-tab workflow is needed.
let selectedCommandText: string | undefined;
let listSelectionFailed = false;
let shortcutQueue = Promise.resolve();

async function handleShortcut({ action, position }: Shortcut, text: string) {
  if (action === 'selectList') {
    const response = await sendMessage({
      type: 'shortcut.list.select',
      position,
    });
    listSelectionFailed = !response.ok;
    if (response.ok) showToast(t('listChanged'), response.data.listName);
    else if (response.error === 'POSITION_NOT_FOUND')
      showToast(t('operationFailed'), t('shortcutListRequired'), 'error');
    else showFailure(response.error);
    return;
  }

  if (action === 'selectCommand') {
    selectedCommandText = undefined;
    const response = await sendMessage({
      type: 'shortcut.command.get',
      position,
    });
    if (!response.ok) {
      showFailure(response.error);
      return;
    }
    selectedCommandText = response.data.text;
    if (!(await writeClipboard(selectedCommandText))) {
      showToast(t('copyFailed'), t('snippetSourceClipboardFailed'), 'error');
      return;
    }
    showToast(
      t('snippetSourceCopied', String(position)),
      response.data.listName,
    );
    return;
  }

  if (action === 'copy') {
    if (listSelectionFailed) {
      showToast(t('operationFailed'), t('shortcutListRequired'), 'error');
      return;
    }
    if (selectedCommandText === undefined) {
      showToast(t('operationFailed'), t('snippetSourceRequired'), 'error');
      return;
    }
    text = selectedCommandText;
  }

  const response = await sendMessage({
    type: action === 'copy' ? 'shortcut.command.copy' : 'shortcut.command.set',
    position,
    text,
  });
  if (!response.ok) {
    showFailure(response.error);
    return;
  }
  showToast(
    action === 'copy'
      ? t('snippetCopiedToSlot', [response.data.listName, String(position)])
      : t('snippetSaved', response.data.listName),
    response.data.text.replace(/\s+/g, ' ').trim().slice(0, 60),
  );
}

if (window.top === window && /^https?:$/.test(location.protocol)) {
  const mac = navigator.platform.startsWith('Mac');
  let leftAlt = false;
  let rightAlt = false;
  window.addEventListener('blur', () => {
    leftAlt = false;
    rightAlt = false;
  });
  window.addEventListener(
    'keyup',
    (event) => {
      if (!event.isTrusted) return;
      if (event.code === 'AltLeft') leftAlt = false;
      if (event.code === 'AltRight') rightAlt = false;
    },
    true,
  );
  window.addEventListener(
    'keydown',
    (event) => {
      if (!event.isTrusted) return;
      if (event.code === 'AltLeft') leftAlt = true;
      if (event.code === 'AltRight') rightAlt = true;
      const shortcut = getShortcut(event, mac, leftAlt && !rightAlt);
      if (!shortcut || !event.cancelable) return;
      const text = shortcut.action === 'save' ? getSelectedText() : '';
      if (shortcut.action === 'save' && !text.trim()) return;

      // Cancel before storage work starts, including repeated keys held in an editor.
      event.preventDefault();
      if (event.repeat) return;
      shortcutQueue = shortcutQueue
        .then(() => handleShortcut(shortcut, text))
        .catch(() => showFailure('STORAGE_ERROR'));
    },
    true,
  );
}
