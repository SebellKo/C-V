import type { ListMetadata } from '../shared/type.d.ts';

export type StateMutation =
  | { type: 'list.create'; listId: string; name: string }
  | { type: 'list.select'; listId: string | null }
  | { type: 'list.selectAt'; index: number }
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
    }
  | {
      type: 'command.setCurrentAt';
      index: number;
      newCommandId: string;
      text: string;
    };
