import isValidListName from '../isValidListName.js';
import { updateState } from '../appState.js';

const hasDuplicates = (items) => new Set(items).size !== items.length;

const editList = async ({ orderedIds, renamedLists, deletedIds }) => {
  let result;

  await updateState((state) => {
    if (
      orderedIds.length === 0 &&
      renamedLists.length === 0 &&
      deletedIds.length === 0
    ) {
      result = { isDuplicated: false, isInvalidName: false };
      return state;
    }

    const records = state.lists.map((list, index) => ({
      list,
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
    const updatedLists = [...reorderedRecords, ...unmentionedRecords].map(
      (record, order) => ({
        ...record.list,
        name: renamedListById.get(record.list.id) ?? record.list.name,
        order,
      }),
    );
    const updatedNames = updatedLists.map((list) => list.name);

    if (updatedNames.some((name) => !isValidListName(name))) {
      result = { isInvalidName: true };
      return state;
    }

    if (hasDuplicates(updatedNames)) {
      result = { isDuplicated: true };
      return state;
    }

    state.lists = updatedLists;
    if (
      state.currentListId !== null &&
      !updatedLists.some((list) => list.id === state.currentListId)
    ) {
      state.currentListId = null;
    }

    result = { isDuplicated: false, isInvalidName: false };
    return state;
  });

  return result;
};

export default editList;
