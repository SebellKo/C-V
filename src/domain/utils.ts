import type { AppState, List, StateErrorCode } from './type.d.ts';

export class StateError extends Error {
  readonly code: StateErrorCode;

  constructor(code: StateErrorCode) {
    super(code);
    this.name = 'StateError';
    this.code = code;
  }
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isValidId = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const invalidState = (): never => {
  throw new StateError('INVALID_STATE');
};

export const normalizeListName = (
  name: string,
  maxLength: number,
): string => {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    throw new StateError('LIST_NAME_REQUIRED');
  }

  if (normalizedName.length > maxLength) {
    throw new StateError('LIST_NAME_TOO_LONG');
  }

  return normalizedName;
};

export const validateCommandText = (text: string): string => {
  if (text.trim().length === 0) {
    throw new StateError('COMMAND_REQUIRED');
  }

  return text;
};

export const assertMutationId = (id: string): void => {
  if (!isValidId(id)) {
    throw new StateError('INVALID_ID');
  }
};

export const findListIndex = (state: AppState, listId: string): number => {
  const index = state.lists.findIndex((list) => list.id === listId);

  if (index === -1) {
    throw new StateError('LIST_NOT_FOUND');
  }

  return index;
};

export const replaceList = (
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

export const assertUniqueCommandText = (
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
