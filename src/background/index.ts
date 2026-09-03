import { handleMessage } from './message.ts';

const storageAccessReady = chrome.storage.local.setAccessLevel({
  accessLevel: 'TRUSTED_CONTEXTS',
});

void storageAccessReady.catch(() => undefined);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  void handleMessage(message).then(sendResponse);

  return true;
});
