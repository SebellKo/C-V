export const APP_STATE_SCHEMA_VERSION = 1 as const;
export const MAX_LIST_COUNT = 10;
export const MAX_COMMAND_COUNT = 10;
export const MAX_LIST_NAME_LENGTH = 100;

export type Command = {
  id: string;
  text: string;
};

export type List = {
  id: string;
  name: string;
  commands: Command[];
};

export type AppState = {
  schemaVersion: typeof APP_STATE_SCHEMA_VERSION;
  currentListId: string | null;
  lists: List[];
};

export type ListMetadata = {
  id: string;
  name: string;
};

export type StateMutation =
  | { type: 'list.create'; listId: string; name: string }
  | { type: 'list.select'; listId: string | null }
  | { type: 'lists.updateMetadata'; lists: ListMetadata[] }
  | {
      type: 'command.create';
      listId: string;
      commandId: string;
      text: string;
    }
  | {
      type: 'command.update';
      listId: string;
      commandId: string;
      text: string;
    }
  | { type: 'command.delete'; listId: string; commandId: string }
  | { type: 'command.clear'; listId: string }
  | {
      type: 'command.swap';
      listId: string;
      sourceId: string;
      targetId: string;
    }
  | {
      type: 'command.setAt';
      listId: string;
      index: number;
      newCommandId: string;
      text: string;
    };

export type StateErrorCode =
  | 'INVALID_STATE'
  | 'INVALID_ID'
  | 'DUPLICATE_ID'
  | 'LIST_NOT_FOUND'
  | 'LIST_LIMIT_REACHED'
  | 'LIST_NAME_REQUIRED'
  | 'LIST_NAME_TOO_LONG'
  | 'LIST_NAME_DUPLICATED'
  | 'INVALID_LIST_METADATA'
  | 'COMMAND_NOT_FOUND'
  | 'COMMAND_LIMIT_REACHED'
  | 'COMMAND_REQUIRED'
  | 'COMMAND_DUPLICATED';

export class StateError extends Error {
  readonly code: StateErrorCode;

  constructor(code: StateErrorCode) {
    super(code);
    this.name = 'StateError';
    this.code = code;
  }
}

export const createInitialState = (): AppState => ({
  schemaVersion: APP_STATE_SCHEMA_VERSION,
  currentListId: null,
  lists: [],
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidId = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const invalidState = (): never => {
  throw new StateError('INVALID_STATE');
};

const normalizeListName = (name: string): string => {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    throw new StateError('LIST_NAME_REQUIRED');
  }

  if (normalizedName.length > MAX_LIST_NAME_LENGTH) {
    throw new StateError('LIST_NAME_TOO_LONG');
  }

  return normalizedName;
};

const validateCommandText = (text: string): string => {
  if (text.trim().length === 0) {
    throw new StateError('COMMAND_REQUIRED');
  }

  return text;
};

export const parseAppState = (value: unknown): AppState => {
  if (
    !isRecord(value) ||
    value.schemaVersion !== APP_STATE_SCHEMA_VERSION ||
    (value.currentListId !== null && !isValidId(value.currentListId)) ||
    !Array.isArray(value.lists) ||
    value.lists.length > MAX_LIST_COUNT
  ) {
    return invalidState();
  }

  const listIds = new Set<string>();
  const listNames = new Set<string>();
  const commandIds = new Set<string>();
  const lists: List[] = value.lists.map((candidate) => {
    if (
      !isRecord(candidate) ||
      !isValidId(candidate.id) ||
      typeof candidate.name !== 'string' ||
      candidate.name !== candidate.name.trim() ||
      candidate.name.length === 0 ||
      candidate.name.length > MAX_LIST_NAME_LENGTH ||
      !Array.isArray(candidate.commands) ||
      candidate.commands.length > MAX_COMMAND_COUNT ||
      listIds.has(candidate.id) ||
      listNames.has(candidate.name)
    ) {
      return invalidState();
    }

    listIds.add(candidate.id);
    listNames.add(candidate.name);

    const commandTexts = new Set<string>();
    const commands: Command[] = candidate.commands.map((command) => {
      if (
        !isRecord(command) ||
        !isValidId(command.id) ||
        typeof command.text !== 'string' ||
        command.text.trim().length === 0 ||
        commandIds.has(command.id) ||
        commandTexts.has(command.text)
      ) {
        return invalidState();
      }

      commandIds.add(command.id);
      commandTexts.add(command.text);

      return { id: command.id, text: command.text };
    });

    return { id: candidate.id, name: candidate.name, commands };
  });

  return {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    currentListId:
      value.currentListId !== null && listIds.has(value.currentListId)
        ? value.currentListId
        : null,
    lists,
  };
};

const assertMutationId = (id: string): void => {
  if (!isValidId(id)) {
    throw new StateError('INVALID_ID');
  }
};

const findListIndex = (state: AppState, listId: string): number => {
  const index = state.lists.findIndex((list) => list.id === listId);

  if (index === -1) {
    throw new StateError('LIST_NOT_FOUND');
  }

  return index;
};

const replaceList = (
  state: AppState,
  listIndex: number,
  list: List,
): AppState => {
  const currentList = state.lists[listIndex];

  if (currentList === list) {
    return state;
  }

  const lists = [...state.lists];
  lists[listIndex] = list;

  return { ...state, lists };
};

const assertUniqueCommandText = (
  list: List,
  text: string,
  ignoredCommandId?: string,
): void => {
  if (
    list.commands.some(
      (command) => command.id !== ignoredCommandId && command.text === text,
    )
  ) {
    throw new StateError('COMMAND_DUPLICATED');
  }
};

const createList = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'list.create' }>,
): AppState => {
  assertMutationId(mutation.listId);

  if (state.lists.some((list) => list.id === mutation.listId)) {
    throw new StateError('DUPLICATE_ID');
  }

  if (state.lists.length >= MAX_LIST_COUNT) {
    throw new StateError('LIST_LIMIT_REACHED');
  }

  const name = normalizeListName(mutation.name);

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
    assertMutationId(listId);
    findListIndex(state, listId);
  }

  return state.currentListId === listId ? state : { ...state, currentListId: listId };
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

    const normalizedName = normalizeListName(name);

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
  assertMutationId(mutation.commandId);
  const listIndex = findListIndex(state, mutation.listId);
  const list = state.lists[listIndex];

  if (!list) {
    throw new StateError('LIST_NOT_FOUND');
  }

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

  const text = validateCommandText(mutation.text);
  assertUniqueCommandText(list, text);

  return replaceList(state, listIndex, {
    ...list,
    commands: [...list.commands, { id: mutation.commandId, text }],
  });
};

const updateCommand = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.update' }>,
): AppState => {
  const listIndex = findListIndex(state, mutation.listId);
  const list = state.lists[listIndex];

  if (!list) {
    throw new StateError('LIST_NOT_FOUND');
  }

  const commandIndex = list.commands.findIndex(
    (command) => command.id === mutation.commandId,
  );

  if (commandIndex === -1) {
    throw new StateError('COMMAND_NOT_FOUND');
  }

  const currentCommand = list.commands[commandIndex];
  const text = validateCommandText(mutation.text);

  if (!currentCommand || currentCommand.text === text) {
    return state;
  }

  assertUniqueCommandText(list, text, mutation.commandId);
  const commands = [...list.commands];
  commands[commandIndex] = { ...currentCommand, text };

  return replaceList(state, listIndex, { ...list, commands });
};

const deleteCommand = (
  state: AppState,
  listId: string,
  commandId: string,
): AppState => {
  const listIndex = findListIndex(state, listId);
  const list = state.lists[listIndex];

  if (!list) {
    throw new StateError('LIST_NOT_FOUND');
  }

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
  const listIndex = findListIndex(state, listId);
  const list = state.lists[listIndex];

  if (!list) {
    throw new StateError('LIST_NOT_FOUND');
  }

  return list.commands.length === 0
    ? state
    : replaceList(state, listIndex, { ...list, commands: [] });
};

const swapCommands = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.swap' }>,
): AppState => {
  const listIndex = findListIndex(state, mutation.listId);
  const list = state.lists[listIndex];

  if (!list || mutation.sourceId === mutation.targetId) {
    return state;
  }

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
  const sourceCommand = commands[sourceIndex];
  const targetCommand = commands[targetIndex];

  if (!sourceCommand || !targetCommand) {
    return state;
  }

  commands[sourceIndex] = targetCommand;
  commands[targetIndex] = sourceCommand;

  return replaceList(state, listIndex, { ...list, commands });
};

const setCommandAt = (
  state: AppState,
  mutation: Extract<StateMutation, { type: 'command.setAt' }>,
): AppState => {
  const listIndex = findListIndex(state, mutation.listId);
  const list = state.lists[listIndex];

  if (
    !list ||
    !Number.isInteger(mutation.index) ||
    mutation.index < 0 ||
    mutation.index > list.commands.length
  ) {
    return state;
  }

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
