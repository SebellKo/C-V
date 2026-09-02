import { createInitialState, parseAppState } from '../domain/state.ts';
import type { AppState } from '../domain/type.d.ts';

const STORAGE_KEY = 'cvState';

let operationQueue: Promise<void> = Promise.resolve();

export const enqueue = <Result>(
  operation: () => Promise<Result>,
): Promise<Result> => {
  const result = operationQueue.then(operation);

  operationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
};

export const readState = async (): Promise<AppState> => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);

  if (!Object.prototype.hasOwnProperty.call(stored, STORAGE_KEY)) {
    return createInitialState();
  }

  return parseAppState(stored[STORAGE_KEY]);
};

export const writeState = (state: AppState): Promise<void> =>
  chrome.storage.local.set({ [STORAGE_KEY]: state });
