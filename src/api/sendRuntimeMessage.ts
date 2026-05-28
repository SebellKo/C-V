import type {
  ResponseForRequest,
  RuntimeRequest,
} from '../types/messages';

const sendRuntimeMessage = async <TRequest extends RuntimeRequest>(
  request: TRequest,
): Promise<ResponseForRequest<TRequest>> => {
  const response = await chrome.runtime.sendMessage(request);

  return response as ResponseForRequest<TRequest>;
};

export default sendRuntimeMessage;
