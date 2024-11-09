const getCurrentListName = async () => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'get-current-list-name',
      })
      .then((response) => resolve(response));
  });

  return result;
};
