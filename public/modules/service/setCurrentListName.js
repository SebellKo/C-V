import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import getList from './getList.js';

const setCurrentListName = async (index) => {
  const listArr = await getList();

  return withStore('currentList', 'readwrite', async (store) => {
    const currentListName = listArr[index].name;
    const newCurrentListName = { name: currentListName };

    await requestToPromise(store.put(newCurrentListName, 1));
  });
};

export default setCurrentListName;
