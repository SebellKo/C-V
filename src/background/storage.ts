import type { AppState } from '../shared/type.d.ts';
import { createInitialState, parseAppState } from './stateRules.ts';
import { StateError } from './stateError.ts';

const STORAGE_KEY = 'cvState';

export const readState = async (): Promise<AppState> => {
  let stored: Record<string, unknown>;
  try {
    stored = await chrome.storage.local.get(STORAGE_KEY);
  } catch {
    throw new StateError('STORAGE_READ_ERROR');
  }

  if (!Object.hasOwn(stored, STORAGE_KEY)) {
    return createInitialState();
  }

  return parseAppState(stored[STORAGE_KEY]);
};

export const writeState = async (state: AppState): Promise<void> => {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
  } catch (error) {
    // ponytail: Chrome의 quota 메시지로 구분한다. 오류 code API가 생기면 교체한다.
    throw new StateError(
      error instanceof Error && /quota/i.test(error.message)
        ? 'STORAGE_QUOTA_EXCEEDED'
        : 'STORAGE_WRITE_ERROR',
    );
  }
};
