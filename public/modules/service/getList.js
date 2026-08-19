import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const getList = () =>
  withStore('list', 'readonly', (store) =>
    requestToPromise(store.getAll()),
  );

export default getList;
