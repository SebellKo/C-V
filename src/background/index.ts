const storageAccessReady = chrome.storage.local.setAccessLevel({
  accessLevel: 'TRUSTED_CONTEXTS',
});

void storageAccessReady.catch(() => undefined);
