const getListByName = async (currentListName, nameIndex) => {
  const currentList = await new Promise((resolve, reject) => {
    const getCurrentListRequest = nameIndex.get(currentListName);

    getCurrentListRequest.onsuccess = (event) => resolve(event.target.result);
    getCurrentListRequest.onerror = (error) => reject(error);
  });

  return currentList;
};

export default getListByName;
