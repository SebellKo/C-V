const getCurrentListId = async () => {
  const response = await chrome.runtime.sendMessage({
    type: 'get-current-list-id',
  });

  if (!response.ok) {
    throw new Error(response.error.message);
  }

  return response.data.currentListId;
};
