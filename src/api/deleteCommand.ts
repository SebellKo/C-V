import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandText, ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const deleteCommand = async (
  currentListName: ListName,
  command: CommandText,
): Promise<RuntimeResponse<'delete-command'>> => {
  return sendRuntimeMessage({
    type: 'delete-command',
    message: {
      currentListName,
      targetCommand: command,
    },
  });
};

export default deleteCommand;
