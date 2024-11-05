const getPrimaryKey = async (currentListName, nameIndex) => {
  const primaryKey = await new Promise((resolve, reject) => {
    const getKeyRequest = nameIndex.getKey(currentListName);

    getKeyRequest.onsuccess = (event) => resolve(event.target.result);
    getKeyRequest.onerror = (error) => reject(error);
  });

  return primaryKey;
};

export default getPrimaryKey;
