const putEditList = async (updatedList) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'edit-list',
        message: { newList: updatedList },
      })
      .then((response) => {
        resolve(response);
      });
  });

  return result;
};

export default putEditList;
