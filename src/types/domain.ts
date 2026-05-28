export type ListId = string;

export type ListName = string;

export type CommandText = string;

export type ShortcutIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type IndexedDBStoreName = 'list' | 'currentList';

export type IndexedDBPermission = IDBTransactionMode;

export interface CommandList {
  id: ListId;
  name: ListName;
  commands: CommandText[];
}

export interface CurrentListRecord {
  name: ListName;
}

export type CommandListPrimaryKey = IDBValidKey;

export interface DuplicateResult {
  isDuplicated: boolean;
}

export interface FullResult {
  isFull: boolean;
}

export interface SuccessResult {
  success: true;
}
