import type {
  AppState,
  Command,
  List,
  ListMetadata,
  StateMutation,
} from './type.d.ts';
import { StateError } from './stateError.ts';
import { isRecord } from './utils.ts';

export { StateError } from './stateError.ts';

export const APP_STATE_SCHEMA_VERSION = 1 as const;
export const MAX_LIST_COUNT = 10;
export const MAX_COMMAND_COUNT = 10;
export const MAX_LIST_NAME_LENGTH = 100;

export const createInitialState = (): AppState => ({
  schemaVersion: APP_STATE_SCHEMA_VERSION,
  currentListId: null,
  lists: [],
});

const isValidId = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const validateListName = (name: string): void => {
  if (name.length === 0) {
    throw new StateError('LIST_NAME_REQUIRED');
  }

  if (name.length > MAX_LIST_NAME_LENGTH) {
    throw new StateError('LIST_NAME_TOO_LONG');
  }
};

const validateCommandText = (text: string): void => {
  if (text.trim().length === 0) {
    throw new StateError('COMMAND_REQUIRED');
  }
};

export const parseAppState = (value: unknown): AppState => {
  if (!isRecord(value)) {
    throw new StateError('INVALID_STATE');
  }

  const { currentListId, lists: storedLists, schemaVersion } = value;

  if (schemaVersion !== APP_STATE_SCHEMA_VERSION) {
    throw new StateError('INVALID_STATE');
  }

  if (currentListId !== null && !isValidId(currentListId)) {
    throw new StateError('INVALID_STATE');
  }

  if (!Array.isArray(storedLists)) {
    throw new StateError('INVALID_STATE');
  }

  const listIds = new Set<string>();
  const commandIds = new Set<string>();
  const lists: List[] = [];

  for (const storedList of storedLists) {
    if (!isRecord(storedList)) {
      throw new StateError('INVALID_STATE');
    }

    const { commands: storedCommands, id, name } = storedList;

    if (!isValidId(id) || typeof name !== 'string') {
      throw new StateError('INVALID_STATE');
    }

    if (!Array.isArray(storedCommands)) {
      throw new StateError('INVALID_STATE');
    }

    if (listIds.has(id)) {
      throw new StateError('INVALID_STATE');
    }

    listIds.add(id);

    const commands: Command[] = [];

    for (const storedCommand of storedCommands) {
      if (!isRecord(storedCommand)) {
        throw new StateError('INVALID_STATE');
      }

      const { id: commandId, text } = storedCommand;

      if (!isValidId(commandId) || typeof text !== 'string') {
        throw new StateError('INVALID_STATE');
      }

      if (commandIds.has(commandId)) {
        throw new StateError('INVALID_STATE');
      }

      commandIds.add(commandId);
      commands.push({ id: commandId, text });
    }

    lists.push({ id, name, commands });
  }

  return {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    currentListId:
      currentListId !== null && listIds.has(currentListId)
        ? currentListId
        : null,
    lists,
  };
};

const findList = (
  state: AppState,
  listId: string,
): { list: List; listIndex: number } | undefined => {
  const listIndex = state.lists.findIndex((list) => list.id === listId);
  const list = state.lists[listIndex];

  return list ? { list, listIndex } : undefined;
};

const replaceList = (
  state: AppState,
  listIndex: number,
  list: List,
): AppState => {
  const lists = [...state.lists];
  lists[listIndex] = list;

  return { ...state, lists };
};

const hasDuplicateCommandText = (
  list: List,
  text: string,
  ignoredCommandId?: string,
): boolean =>
  list.commands.some(
    (command) => command.id !== ignoredCommandId && command.text === text,
  );

const createList = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'list.create' }>,
): AppState => {
  if (!isValidId(mutation.listId)) {
    throw new StateError('INVALID_ID');
  }

  if (state.lists.some((list) => list.id === mutation.listId)) {
    throw new StateError('DUPLICATE_ID');
  }

  if (state.lists.length >= MAX_LIST_COUNT) {
    throw new StateError('LIST_LIMIT_REACHED');
  }

  const name = mutation.name.trim();
  validateListName(name);

  if (state.lists.some((list) => list.name === name)) {
    throw new StateError('LIST_NAME_DUPLICATED');
  }

  return {
    ...state,
    lists: [...state.lists, { id: mutation.listId, name, commands: [] }],
  };
};

const selectList = (
  state: AppState,
  listId: string | null,
): AppState => {
  if (listId !== null) {
    if (!isValidId(listId)) {
      throw new StateError('INVALID_ID');
    }

    if (!findList(state, listId)) {
      throw new StateError('LIST_NOT_FOUND');
    }
  }

  return state.currentListId === listId
    ? state
    : { ...state, currentListId: listId };
};

const updateListMetadata = (
  state: AppState,
  metadata: ListMetadata[],
): AppState => {
  if (metadata.length > state.lists.length) {
    throw new StateError('INVALID_LIST_METADATA');
  }

  const currentLists = new Map(state.lists.map((list) => [list.id, list]));
  const nextIds = new Set<string>();
  const nextNames = new Set<string>();
  const lists = metadata.map(({ id, name }) => {
    const currentList = currentLists.get(id);

    if (!currentList || nextIds.has(id)) {
      throw new StateError('INVALID_LIST_METADATA');
    }

    const normalizedName = name.trim();
    validateListName(normalizedName);

    if (nextNames.has(normalizedName)) {
      throw new StateError('LIST_NAME_DUPLICATED');
    }

    nextIds.add(id);
    nextNames.add(normalizedName);

    return currentList.name === normalizedName
      ? currentList
      : { ...currentList, name: normalizedName };
  });
  const currentListId =
    state.currentListId !== null && nextIds.has(state.currentListId)
      ? state.currentListId
      : null;
  const isUnchanged =
    currentListId === state.currentListId &&
    lists.length === state.lists.length &&
    lists.every((list, index) => list === state.lists[index]);

  return isUnchanged ? state : { ...state, currentListId, lists };
};

const createCommand = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.create' }>,
): AppState => {
  if (!isValidId(mutation.commandId)) {
    throw new StateError('INVALID_ID');
  }

  const foundList = findList(state, mutation.listId);

  if (!foundList) {
    throw new StateError('LIST_NOT_FOUND');
  }

  const { list, listIndex } = foundList;

  if (
    state.lists.some((candidate) =>
      candidate.commands.some((command) => command.id === mutation.commandId),
    )
  ) {
    throw new StateError('DUPLICATE_ID');
  }

  if (list.commands.length >= MAX_COMMAND_COUNT) {
    throw new StateError('COMMAND_LIMIT_REACHED');
  }

  const { text } = mutation;
  validateCommandText(text);

  if (hasDuplicateCommandText(list, text)) {
    throw new StateError('COMMAND_DUPLICATED');
  }

  return replaceList(state, listIndex, {
    ...list,
    commands: [...list.commands, { id: mutation.commandId, text }],
  });
};

const updateCommand = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.update' }>,
): AppState => {
  const foundList = findList(state, mutation.listId);

  if (!foundList) {
    throw new StateError('LIST_NOT_FOUND');
  }

  const { list, listIndex } = foundList;
  const commandIndex = list.commands.findIndex(
    (command) => command.id === mutation.commandId,
  );
  const currentCommand = list.commands[commandIndex];

  if (!currentCommand) {
    throw new StateError('COMMAND_NOT_FOUND');
  }

  const { text } = mutation;
  validateCommandText(text);

  if (currentCommand.text === text) {
    return state;
  }

  if (hasDuplicateCommandText(list, text, mutation.commandId)) {
    throw new StateError('COMMAND_DUPLICATED');
  }

  const commands = [...list.commands];
  commands[commandIndex] = { ...currentCommand, text };

  return replaceList(state, listIndex, { ...list, commands });
};

const deleteCommand = (
  state: AppState,
  listId: string,
  commandId: string,
): AppState => {
  const foundList = findList(state, listId);

  if (!foundList) {
    throw new StateError('LIST_NOT_FOUND');
  }

  const { list, listIndex } = foundList;
  const commandIndex = list.commands.findIndex(
    (command) => command.id === commandId,
  );

  if (commandIndex === -1) {
    throw new StateError('COMMAND_NOT_FOUND');
  }

  return replaceList(state, listIndex, {
    ...list,
    commands: list.commands.filter((_, index) => index !== commandIndex),
  });
};

const clearCommands = (state: AppState, listId: string): AppState => {
  const foundList = findList(state, listId);

  if (!foundList) {
    throw new StateError('LIST_NOT_FOUND');
  }

  const { list, listIndex } = foundList;

  return list.commands.length === 0
    ? state
    : replaceList(state, listIndex, { ...list, commands: [] });
};

const swapCommands = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.swap' }>,
): AppState => {
  const foundList = findList(state, mutation.listId);

  if (!foundList) {
    throw new StateError('LIST_NOT_FOUND');
  }

  if (mutation.sourceId === mutation.targetId) {
    return state;
  }

  const { list, listIndex } = foundList;
  const sourceIndex = list.commands.findIndex(
    (command) => command.id === mutation.sourceId,
  );
  const targetIndex = list.commands.findIndex(
    (command) => command.id === mutation.targetId,
  );

  if (sourceIndex === -1 || targetIndex === -1) {
    return state;
  }

  const commands = [...list.commands];
  const sourceCommand = commands[sourceIndex]!;
  const targetCommand = commands[targetIndex]!;

  commands[sourceIndex] = targetCommand;
  commands[targetIndex] = sourceCommand;

  return replaceList(state, listIndex, { ...list, commands });
};

const setCommandAt = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.setAt' }>,
): AppState => {
  const foundList = findList(state, mutation.listId);

  if (!foundList) {
    throw new StateError('LIST_NOT_FOUND');
  }

  if (
    !Number.isInteger(mutation.index) ||
    mutation.index < 0 ||
    mutation.index > foundList.list.commands.length
  ) {
    return state;
  }

  const { list } = foundList;
  const currentCommand = list.commands[mutation.index];

  if (currentCommand) {
    return updateCommand(state, {
      type: 'command.update',
      listId: mutation.listId,
      commandId: currentCommand.id,
      text: mutation.text,
    });
  }

  return createCommand(state, {
    type: 'command.create',
    listId: mutation.listId,
    commandId: mutation.newCommandId,
    text: mutation.text,
  });
};

export const applyStateMutation = (
  state: AppState,
  mutation: StateMutation,
): AppState => {
  switch (mutation.type) {
    case 'list.create':
      return createList(state, mutation);
    case 'list.select':
      return selectList(state, mutation.listId);
    case 'lists.updateMetadata':
      return updateListMetadata(state, mutation.lists);
    case 'command.create':
      return createCommand(state, mutation);
    case 'command.update':
      return updateCommand(state, mutation);
    case 'command.delete':
      return deleteCommand(state, mutation.listId, mutation.commandId);
    case 'command.clear':
      return clearCommands(state, mutation.listId);
    case 'command.swap':
      return swapCommands(state, mutation);
    case 'command.setAt':
      return setCommandAt(state, mutation);
  }
};
