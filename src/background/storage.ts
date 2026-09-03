import type { AppState } from '../shared/type.d.ts';
import { createInitialState, parseAppState } from './stateRules.ts';

const STORAGE_KEY = 'cvState';

export const readState = async (): Promise<AppState> => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);

  if (!Object.hasOwn(stored, STORAGE_KEY)) {
    return createInitialState();
  }

  return parseAppState(stored[STORAGE_KEY]);
};

export const writeState = (state: AppState): Promise<void> =>
  chrome.storage.local.set({ [STORAGE_KEY]: state });
