import type {
  AppState,
  List,
  MessageData,
  MessageErrorCode,
  MessageRequest,
  MessageResponse,
  ShortcutCommandResult,
  ShortcutListResult,
} from '../shared/type.d.ts';
import { parseMessageRequest } from './parseRequest.ts';
import { StateError } from './stateError.ts';
import { getState, mutateState } from './stateCoordinator.ts';

const success = <Request extends MessageRequest>(
  data: MessageData<Request>,
): MessageResponse<Request> => ({ ok: true, data });

const failure = (error: MessageErrorCode): MessageResponse => ({
  ok: false,
  error,
});

const getCurrentList = (state: AppState): List | undefined =>
  state.currentListId === null
    ? undefined
    : state.lists.find((list) => list.id === state.currentListId);

const toListResult = (
  list: List,
  position: number,
): ShortcutListResult => ({
  listId: list.id,
  listName: list.name,
  position,
});

const toCommandResult = (
  list: List,
  position: number,
): ShortcutCommandResult | undefined => {
  const command = list.commands[position - 1];

  return command
    ? {
        ...toListResult(list, position),
        commandId: command.id,
        text: command.text,
      }
    : undefined;
};

const dispatchRequest = async (
  request: MessageRequest,
): Promise<MessageResponse> => {
  switch (request.type) {
    case 'state.get':
      return success<typeof request>(await getState());
    case 'list.create':
      return success<typeof request>(
        await mutateState({
          type: request.type,
          listId: crypto.randomUUID(),
          name: request.name,
        }),
      );
    case 'list.select':
      return success<typeof request>(await mutateState(request));
    case 'lists.updateMetadata':
      return success<typeof request>(await mutateState(request));
    case 'command.create':
      return success<typeof request>(
        await mutateState({
          type: request.type,
          listId: request.listId,
          commandId: crypto.randomUUID(),
          text: request.text,
        }),
      );
    case 'command.update':
    case 'command.delete':
    case 'command.clear':
    case 'command.swap':
      return success<typeof request>(await mutateState(request));
    case 'shortcut.list.select': {
      const state = await mutateState({
        type: 'list.selectAt',
        index: request.position - 1,
      });
      const list = state.lists[request.position - 1];

      return list
        ? success<typeof request>(toListResult(list, request.position))
        : failure('POSITION_NOT_FOUND');
    }
    case 'shortcut.command.get': {
      const list = getCurrentList(await getState());

      if (!list) {
        return failure('CURRENT_LIST_NOT_SELECTED');
      }

      const result = toCommandResult(list, request.position);

      return result
        ? success<typeof request>(result)
        : failure('POSITION_NOT_FOUND');
    }
    case 'shortcut.command.set': {
      const state = await mutateState({
        type: 'command.setCurrentAt',
        index: request.position - 1,
        newCommandId: crypto.randomUUID(),
        text: request.text,
      });
      const list = getCurrentList(state);

      if (!list) {
        return failure('CURRENT_LIST_NOT_SELECTED');
      }

      const result = toCommandResult(list, request.position);

      return result
        ? success<typeof request>(result)
        : failure('POSITION_NOT_FOUND');
    }
  }
};

export const handleMessage = async (
  value: unknown,
): Promise<MessageResponse> => {
  const request = parseMessageRequest(value);

  if (!request) {
    return failure('INVALID_REQUEST');
  }

  try {
    return await dispatchRequest(request);
  } catch (error) {
    return error instanceof StateError
      ? failure(error.code)
      : failure('STORAGE_ERROR');
  }
};
