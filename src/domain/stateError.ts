import type { StateErrorCode } from './type.d.ts';

export class StateError extends Error {
  readonly code: StateErrorCode;

  constructor(code: StateErrorCode) {
    super(code);
    this.name = 'StateError';
    this.code = code;
  }
}
