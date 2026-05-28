import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandText, ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const putEditCommand = async (
  currentListName: ListName,
  targetCommand: CommandText,
  newCommand: CommandText,
): Promise<RuntimeResponse<'edit-command'>> => {
  return sendRuntimeMessage({
    type: 'edit-command',
    message: {
      currentListName,
      targetCommand,
      newCommand,
    },
  });
};

export default putEditCommand;
