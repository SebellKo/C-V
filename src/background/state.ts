import { applyStateMutation, parseAppState } from '../domain/state.ts';
import type { AppState, StateMutation } from '../domain/type.d.ts';
import { readState, writeState } from '../storage/state.ts';

let operationQueue: Promise<void> = Promise.resolve();

const enqueue = <Result>(operation: () => Promise<Result>): Promise<Result> => {
  const result = operationQueue.then(operation);

  operationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
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

    await writeState(stateToSave);

    return stateToSave;
  });
