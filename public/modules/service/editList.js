import isValidListName from '../isValidListName.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { CURRENT_LIST_KEY } from '../../constants/database.js';

const hasDuplicates = (items) => new Set(items).size !== items.length;

const editList = ({ orderedIds, renamedLists, deletedIds }) =>
  withStore(
    ['list', 'currentList'],
    'readwrite',
    async (store, currentStore) => {
      if (
        orderedIds.length === 0 &&
        renamedLists.length === 0 &&
        deletedIds.length === 0
      ) {
        return { isDuplicated: false, isInvalidName: false };
      }

      const [lists, primaryKeys, selectedList] = await Promise.all([
        requestToPromise(store.getAll()),
        requestToPromise(store.getAllKeys()),
        requestToPromise(currentStore.get(CURRENT_LIST_KEY)),
      ]);
      const records = lists.map((list, index) => ({
        list,
        primaryKey: primaryKeys[index],
        previousOrder: Number.isInteger(list.order) ? list.order : index,
      }));
      const recordsById = new Map(
        records.map((record) => [record.list.id, record]),
      );

      const deletedIdSet = new Set(deletedIds);
      const orderedIdSet = new Set(orderedIds);
      const renamedListById = new Map(
        renamedLists.map((list) => [list.id, list.name]),
      );
      const reorderedRecords = [...orderedIdSet]
        .map((id) => recordsById.get(id))
        .filter((record) => record && !deletedIdSet.has(record.list.id));
      const unmentionedRecords = records
        .filter(
          (record) =>
            !deletedIdSet.has(record.list.id) &&
            !orderedIdSet.has(record.list.id),
        )
        .sort((a, b) => a.previousOrder - b.previousOrder);
      const updatedRecords = [...reorderedRecords, ...unmentionedRecords].map(
        (record, order) => ({
          ...record,
          list: {
            ...record.list,
            name: renamedListById.get(record.list.id) ?? record.list.name,
            order,
          },
        }),
      );
      const updatedNames = updatedRecords.map(({ list }) => list.name);

      if (updatedNames.some((name) => !isValidListName(name))) {
        return { isInvalidName: true };
      }

      if (hasDuplicates(updatedNames)) {
        return { isDuplicated: true };
      }

      const requests = [
        ...records
          .filter((record) => deletedIdSet.has(record.list.id))
          .map((record) => store.delete(record.primaryKey)),
        ...updatedRecords.map(({ list, primaryKey }) =>
          store.put(list, primaryKey),
        ),
      ];

      if (
        selectedList &&
        !updatedRecords.some(
          (record) => record.list.id === selectedList.listId,
        )
      ) {
        requests.push(currentStore.clear());
      }

      await Promise.all(requests.map(requestToPromise));
      return { isDuplicated: false, isInvalidName: false };
    },
  );

export default editList;
