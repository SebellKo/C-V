import migrateIndexedDb from './migrateIndexedDb.js';

const APP_STATE_KEY = 'appState';
const APP_STATE_VERSION = 1;

const accessLevelReady = chrome.storage.local.setAccessLevel({
  accessLevel: 'TRUSTED_CONTEXTS',
});

// Avoid an unhandled rejection before the first storage operation observes it.
void accessLevelReady.catch(() => undefined);

let initialization;
let mutationQueue = Promise.resolve();

const createEmptyState = () => ({
  version: APP_STATE_VERSION,
  lists: [],
  currentListId: null,
});

const assertState = (state) => {
  if (
    state === null ||
    typeof state !== 'object' ||
    Array.isArray(state) ||
    state.version !== APP_STATE_VERSION ||
    !Array.isArray(state.lists) ||
    (state.currentListId !== null &&
      typeof state.currentListId !== 'string')
  ) {
    throw new Error('Invalid app state');
  }

  return state;
};

const getStoredState = async () => {
  const stored = await chrome.storage.local.get(APP_STATE_KEY);
  return stored[APP_STATE_KEY];
};

const initializeState = async () => {
  await accessLevelReady;

  const storedState = await getStoredState();
  if (storedState !== undefined) return assertState(storedState);

  const state = (await migrateIndexedDb(APP_STATE_VERSION)) ?? createEmptyState();
  assertState(state);
  await chrome.storage.local.set({ [APP_STATE_KEY]: state });
  return state;
};

const ensureState = () => {
  if (!initialization) {
    initialization = initializeState().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }

  return initialization;
};

export const readState = async () => {
  await ensureState();
  return assertState(await getStoredState());
};

export const updateState = (updater) => {
  const operation = mutationQueue.then(async () => {
    const currentState = await readState();
    const nextState = assertState(await updater(currentState));
    await chrome.storage.local.set({ [APP_STATE_KEY]: nextState });
    return nextState;
  });

  mutationQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
};
