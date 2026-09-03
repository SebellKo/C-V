import type { MessageRequest } from '../shared/type.d.ts';
import { isRecord } from '../utils/isRecord.ts';

const hasString = <Key extends string>(
  value: Record<string, unknown>,
  key: Key,
): value is Record<string, unknown> & Record<Key, string> =>
  typeof value[key] === 'string';

const hasPosition = (
  value: Record<string, unknown>,
): value is Record<string, unknown> & { position: number } =>
  Number.isInteger(value.position) &&
  Number(value.position) >= 1 &&
  Number(value.position) <= 10;

export const parseMessageRequest = (
  value: unknown,
): MessageRequest | undefined => {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return undefined;
  }

  switch (value.type) {
    case 'state.get':
      return { type: value.type };
    case 'list.create':
      return hasString(value, 'name')
        ? { type: value.type, name: value.name }
        : undefined;
    case 'list.select':
      return typeof value.listId === 'string' || value.listId === null
        ? { type: value.type, listId: value.listId }
        : undefined;
    case 'lists.updateMetadata': {
      if (!Array.isArray(value.lists)) {
        return undefined;
      }

      const lists: { id: string; name: string }[] = [];

      for (const list of value.lists) {
        if (
          !isRecord(list) ||
          !hasString(list, 'id') ||
          !hasString(list, 'name')
        ) {
          return undefined;
        }

        lists.push({ id: list.id, name: list.name });
      }

      return { type: value.type, lists };
    }
    case 'command.create':
      return hasString(value, 'listId') && hasString(value, 'text')
        ? {
            type: value.type,
            listId: value.listId,
            text: value.text,
          }
        : undefined;
    case 'command.update':
      return hasString(value, 'listId') &&
        hasString(value, 'commandId') &&
        hasString(value, 'text')
        ? {
            type: value.type,
            listId: value.listId,
            commandId: value.commandId,
            text: value.text,
          }
        : undefined;
    case 'command.delete':
      return hasString(value, 'listId') && hasString(value, 'commandId')
        ? {
            type: value.type,
            listId: value.listId,
            commandId: value.commandId,
          }
        : undefined;
    case 'command.clear':
      return hasString(value, 'listId')
        ? { type: value.type, listId: value.listId }
        : undefined;
    case 'command.swap':
      return hasString(value, 'listId') &&
        hasString(value, 'sourceId') &&
        hasString(value, 'targetId')
        ? {
            type: value.type,
            listId: value.listId,
            sourceId: value.sourceId,
            targetId: value.targetId,
          }
        : undefined;
    case 'shortcut.list.select':
    case 'shortcut.command.get':
      return hasPosition(value)
        ? { type: value.type, position: value.position }
        : undefined;
    case 'shortcut.command.set':
      return hasPosition(value) && hasString(value, 'text')
        ? {
            type: value.type,
            position: value.position,
            text: value.text,
          }
        : undefined;
    default:
      return undefined;
  }
};
