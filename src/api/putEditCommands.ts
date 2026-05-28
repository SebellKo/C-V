import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandText, ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const putEditCommands = async (
  currentListName: ListName,
  updatedCommands: CommandText[],
): Promise<RuntimeResponse<'edit-commands'>> => {
  return sendRuntimeMessage({
    type: 'edit-commands',
    message: {
      currentListName,
      updatedCommands,
    },
  });
};

export default putEditCommands;
