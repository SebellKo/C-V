const getListByName = async (listName) => {
  const data = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({ type: 'get-list-by-name', message: { name: listName } })
      .then((response) => {
        resolve(response.listData);
      });
  });
  return data;
};

export default getListByName;
