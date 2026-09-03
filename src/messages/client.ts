import type {
  MessageErrorCode,
  MessageRequest,
  MessageResponse,
} from './type.d.ts';

const MESSAGE_ERROR_CODES: ReadonlySet<MessageErrorCode> = new Set([
  'INVALID_STATE',
  'INVALID_ID',
  'DUPLICATE_ID',
  'LIST_NOT_FOUND',
  'LIST_LIMIT_REACHED',
  'LIST_NAME_REQUIRED',
  'LIST_NAME_TOO_LONG',
  'LIST_NAME_DUPLICATED',
  'INVALID_LIST_METADATA',
  'COMMAND_NOT_FOUND',
  'COMMAND_LIMIT_REACHED',
  'COMMAND_REQUIRED',
  'COMMAND_DUPLICATED',
  'INVALID_REQUEST',
  'CURRENT_LIST_NOT_SELECTED',
  'POSITION_NOT_FOUND',
  'STORAGE_ERROR',
  'MESSAGE_UNAVAILABLE',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isMessageResponse = (value: unknown): value is MessageResponse => {
  if (!isRecord(value)) {
    return false;
  }

  if (value.ok === true) {
    return Object.prototype.hasOwnProperty.call(value, 'data');
  }

  return (
    value.ok === false &&
    typeof value.error === 'string' &&
    MESSAGE_ERROR_CODES.has(value.error as MessageErrorCode)
  );
};

export const sendMessage = async <Request extends MessageRequest>(
  request: Request,
): Promise<MessageResponse<Request>> => {
  try {
    const response: unknown = await chrome.runtime.sendMessage(request);

    return isMessageResponse(response)
      ? (response as MessageResponse<Request>)
      : { ok: false, error: 'MESSAGE_UNAVAILABLE' };
  } catch {
    return { ok: false, error: 'MESSAGE_UNAVAILABLE' };
  }
};
