import { createInitialState, parseAppState } from '../domain/state.ts';
import type { AppState } from '../domain/type.d.ts';

const STORAGE_KEY = 'cvState';

export const readState = async (): Promise<AppState> => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);

  if (!Object.prototype.hasOwnProperty.call(stored, STORAGE_KEY)) {
    return createInitialState();
  }

  return parseAppState(stored[STORAGE_KEY]);
};

export const writeState = (state: AppState): Promise<void> =>
  chrome.storage.local.set({ [STORAGE_KEY]: state });
