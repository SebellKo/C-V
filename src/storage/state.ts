import {
  applyStateMutation,
  createInitialState,
  parseAppState,
  type AppState,
  type StateMutation,
} from '../domain/state.ts';

const STORAGE_KEY = 'cvState';

let operationQueue: Promise<void> = Promise.resolve();

const enqueue = <Result>(operation: () => Promise<Result>): Promise<Result> => {
  const result = operationQueue.then(operation);

  operationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
};

const readState = async (): Promise<AppState> => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);

  if (!Object.prototype.hasOwnProperty.call(stored, STORAGE_KEY)) {
    return createInitialState();
  }

  return parseAppState(stored[STORAGE_KEY]);
};

export const getState = (): Promise<AppState> => enqueue(readState);

export const mutateState = (mutation: StateMutation): Promise<AppState> =>
  enqueue(async () => {
    const currentState = await readState();
    const nextState = applyStateMutation(currentState, mutation);

    if (nextState === currentState) {
      return currentState;
    }

    const stateToSave = parseAppState(nextState);

    await chrome.storage.local.set({ [STORAGE_KEY]: stateToSave });

    return stateToSave;
  });
