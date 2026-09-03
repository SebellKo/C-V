import type { AppState } from '../shared/type.d.ts';
import { applyStateMutation } from './stateRules.ts';
import { readState, writeState } from './storage.ts';
import type { StateMutation } from './type.d.ts';

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

    await writeState(nextState);

    return nextState;
  });
