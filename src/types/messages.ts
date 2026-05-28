import type {
  CommandList,
  CommandText,
  ListId,
  ListName,
  ShortcutIndex,
  SuccessResult,
} from './domain';

export type RuntimeMessageType =
  | 'add-list'
  | 'get-list'
  | 'edit-list'
  | 'get-list-by-name'
  | 'add-new-command'
  | 'edit-commands'
  | 'delete-command'
  | 'edit-command'
  | 'delete-commands'
  | 'get-current-list-name'
  | 'set-current-list-name'
  | 'set-command-by-index'
  | 'get-current-command';

export interface AddListRequest {
  type: 'add-list';
  message: {
    listName: ListName;
    id: ListId;
  };
}

export interface GetListRequest {
  type: 'get-list';
}

export interface EditListRequest {
  type: 'edit-list';
  message: {
    newList: CommandList[];
  };
}

export interface GetListByNameRequest {
  type: 'get-list-by-name';
  message: {
    name: ListName;
  };
}

export interface AddNewCommandRequest {
  type: 'add-new-command';
  message: {
    newCommand: CommandText;
    currentListName: ListName;
  };
}

export interface EditCommandsRequest {
  type: 'edit-commands';
  message: {
    currentListName: ListName;
    updatedCommands: CommandText[];
  };
}

export interface DeleteCommandRequest {
  type: 'delete-command';
  message: {
    currentListName: ListName;
    targetCommand: CommandText;
  };
}

export interface EditCommandRequest {
  type: 'edit-command';
  message: {
    currentListName: ListName;
    targetCommand: CommandText;
    newCommand: CommandText;
  };
}

export interface DeleteCommandsRequest {
  type: 'delete-commands';
  message: {
    currentListName: ListName;
  };
}

export interface GetCurrentListNameRequest {
  type: 'get-current-list-name';
}

export interface SetCurrentListNameRequest {
  type: 'set-current-list-name';
  message: {
    index: ShortcutIndex;
  };
}

export interface SetCommandByIndexRequest {
  type: 'set-command-by-index';
  message: {
    currentListName: ListName;
    newCommand: CommandText;
    index: ShortcutIndex;
  };
}

export interface GetCurrentCommandRequest {
  type: 'get-current-command';
  message: {
    currentListName: ListName;
    index: ShortcutIndex;
  };
}

export type RuntimeRequest =
  | AddListRequest
  | GetListRequest
  | EditListRequest
  | GetListByNameRequest
  | AddNewCommandRequest
  | EditCommandsRequest
  | DeleteCommandRequest
  | EditCommandRequest
  | DeleteCommandsRequest
  | GetCurrentListNameRequest
  | SetCurrentListNameRequest
  | SetCommandByIndexRequest
  | GetCurrentCommandRequest;

export interface DuplicateResponse {
  isDuplicated: true;
}

export interface FullResponse {
  isFull: true;
}

export type MutatingResponse =
  | SuccessResult
  | DuplicateResponse
  | FullResponse;

export interface GetListResponse {
  listData: CommandList[];
}

export interface GetListByNameResponse {
  listData: CommandList | undefined;
}

export interface GetCurrentListNameResponse {
  currentListName: ListName;
}

export interface GetCurrentCommandResponse {
  command: CommandText | undefined;
}

export interface RuntimeResponseMap {
  'add-list': MutatingResponse;
  'get-list': GetListResponse;
  'edit-list': SuccessResult | DuplicateResponse;
  'get-list-by-name': GetListByNameResponse;
  'add-new-command': MutatingResponse;
  'edit-commands': SuccessResult;
  'delete-command': SuccessResult;
  'edit-command': SuccessResult | DuplicateResponse;
  'delete-commands': SuccessResult;
  'get-current-list-name': GetCurrentListNameResponse;
  'set-current-list-name': SuccessResult;
  'set-command-by-index': SuccessResult;
  'get-current-command': GetCurrentCommandResponse;
}

export type RuntimeResponse<TType extends RuntimeMessageType> =
  RuntimeResponseMap[TType];

export type ResponseForRequest<TRequest extends RuntimeRequest> =
  RuntimeResponse<TRequest['type']>;
