import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const getList = () =>
  withStore('list', 'readonly', async (store) => {
    const lists = await requestToPromise(store.getAll());

    return lists
      .map((list, index) => ({
        list,
        order: Number.isInteger(list.order) ? list.order : index,
      }))
      .sort((a, b) => a.order - b.order)
      .map(({ list }) => list);
  });

export default getList;
