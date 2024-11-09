import { v4 as uuidv4 } from 'uuid';

const postList = async (listTitle) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'add-list',
        message: { listName: listTitle, id: uuidv4() },
      })
      .then((response) => {
        resolve(response);
      });
  });
  return result;
};

export default postList;
