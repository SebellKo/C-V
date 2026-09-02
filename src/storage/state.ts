import {
  applyStateMutation,
  parseAppState,
} from '../domain/state.ts';
import type { AppState, StateMutation } from '../domain/type.d.ts';
import { enqueue, readState, writeState } from './utils.ts';

export const getState = (): Promise<AppState> => enqueue(readState);

export const mutateState = (mutation: StateMutation): Promise<AppState> =>
  enqueue(async () => {
    const currentState = await readState();
    const nextState = applyStateMutation(currentState, mutation);

    if (nextState === currentState) {
      return currentState;
    }

    const stateToSave = parseAppState(nextState);

    await writeState(stateToSave);

    return stateToSave;
  });
