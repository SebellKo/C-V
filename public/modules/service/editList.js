import isValidListName from '../isValidListName.js';
import { updateState } from '../appState.js';

const hasDuplicates = (items) => new Set(items).size !== items.length;

const editList = ({ orderedIds, renamedLists, deletedIds }) =>
  updateState((state) => {
    if (
      orderedIds.length === 0 &&
      renamedLists.length === 0 &&
      deletedIds.length === 0
    ) {
      return { isDuplicated: false, isInvalidName: false };
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
      return { isInvalidName: true };
    }

    if (hasDuplicates(updatedNames)) {
      return { isDuplicated: true };
    }

    state.lists = updatedLists;
    if (
      state.currentListId !== null &&
      !updatedLists.some((list) => list.id === state.currentListId)
    ) {
      state.currentListId = null;
    }

    return { isDuplicated: false, isInvalidName: false };
  });

export default editList;
