import type {
  MessageRequest,
  MessageResponse,
} from './type.d.ts';
import { isRecord } from '../utils/isRecord.ts';

const isResponseEnvelope = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  if (value.ok === true) {
    return Object.hasOwn(value, 'data');
  }

  return value.ok === false && typeof value.error === 'string';
};

export const sendMessage = async <Request extends MessageRequest>(
  request: Request,
): Promise<MessageResponse<Request>> => {
  try {
    const response: unknown = await chrome.runtime.sendMessage(request);

    return isResponseEnvelope(response)
      ? (response as MessageResponse<Request>)
      : { ok: false, error: 'MESSAGE_UNAVAILABLE' };
  } catch {
    return { ok: false, error: 'MESSAGE_UNAVAILABLE' };
  }
};
