import type {
  AppState,
  ListMetadata,
  StateErrorCode,
} from '../domain/type.d.ts';

export type MessageRequest =
  | { type: 'state.get' }
  | { type: 'list.create'; name: string }
  | { type: 'list.select'; listId: string | null }
  | { type: 'lists.updateMetadata'; lists: ListMetadata[] }
  | { type: 'command.create'; listId: string; text: string }
  | {
      type: 'command.update';
      listId: string;
      commandId: string;
      text: string;
    }
  | { type: 'command.delete'; listId: string; commandId: string }
  | { type: 'command.clear'; listId: string }
  | {
      type: 'command.swap';
      listId: string;
      sourceId: string;
      targetId: string;
    }
  | { type: 'shortcut.list.select'; position: number }
  | { type: 'shortcut.command.get'; position: number }
  | { type: 'shortcut.command.set'; position: number; text: string };

export type ShortcutListResult = {
  listId: string;
  listName: string;
  position: number;
};

export type ShortcutCommandResult = ShortcutListResult & {
  commandId: string;
  text: string;
};

export type MessageErrorCode =
  | StateErrorCode
  | 'INVALID_REQUEST'
  | 'CURRENT_LIST_NOT_SELECTED'
  | 'POSITION_NOT_FOUND'
  | 'STORAGE_ERROR'
  | 'MESSAGE_UNAVAILABLE';

export type MessageData<Request extends MessageRequest> =
  Request extends { type: 'shortcut.list.select' }
    ? ShortcutListResult
    : Request extends {
          type: 'shortcut.command.get' | 'shortcut.command.set';
        }
      ? ShortcutCommandResult
      : AppState;

export type MessageResponse<Request extends MessageRequest = MessageRequest> =
  | { ok: true; data: MessageData<Request> }
  | { ok: false; error: MessageErrorCode };
