import type { StateErrorCode } from '../shared/type.d.ts';

export class StateError extends Error {
  readonly code: StateErrorCode;

  constructor(code: StateErrorCode) {
    super(code);
    this.name = 'StateError';
    this.code = code;
  }
}
