const getList = async () => {
  const data = await new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'get-list' }).then((response) => {
      resolve(response.listData);
    });
  });
  return data;
};

export default getList;
