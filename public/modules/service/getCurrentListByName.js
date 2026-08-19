import getListByName from '../getListByName.js';
import withStore from '../withStore.js';

const getCurrentListByName = (currentListName) =>
  withStore('list', 'readonly', async (store) => {
    const nameIndex = store.index('name');
    return getListByName(currentListName, nameIndex);
  });

export default getCurrentListByName;
