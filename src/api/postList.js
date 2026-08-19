const postList = async (listTitle) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'add-list',
        message: { listName: listTitle, id: crypto.randomUUID() },
      })
      .then((response) => {
        resolve(response);
      });
  });
  return result;
};

export default postList;
