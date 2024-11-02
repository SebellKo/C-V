chrome.runtime.onInstalled.addListener(() => {
  const indexDB = window.indexedDB;

  if (!indexDB)
    window.alert(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.",
    );
});
