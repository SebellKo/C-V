export type Command = {
  id: string;
  text: string;
};

export type List = {
  id: string;
  name: string;
  commands: Command[];
};

export type AppState = {
  schemaVersion: 1;
  currentListId: string | null;
  lists: List[];
};

export type ListMetadata = {
  id: string;
  name: string;
};

export type StateMutation =
  | { type: 'list.create'; listId: string; name: string }
  | { type: 'list.select'; listId: string | null }
  | { type: 'lists.updateMetadata'; lists: ListMetadata[] }
  | {
      type: 'command.create';
      listId: string;
      commandId: string;
      text: string;
    }
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
  | {
      type: 'command.setAt';
      listId: string;
      index: number;
      newCommandId: string;
      text: string;
    };

export type StateErrorCode =
  | 'INVALID_STATE'
  | 'INVALID_ID'
  | 'DUPLICATE_ID'
  | 'LIST_NOT_FOUND'
  | 'LIST_LIMIT_REACHED'
  | 'LIST_NAME_REQUIRED'
  | 'LIST_NAME_TOO_LONG'
  | 'LIST_NAME_DUPLICATED'
  | 'INVALID_LIST_METADATA'
  | 'COMMAND_NOT_FOUND'
  | 'COMMAND_LIMIT_REACHED'
  | 'COMMAND_REQUIRED'
  | 'COMMAND_DUPLICATED';
