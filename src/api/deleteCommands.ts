import sendRuntimeMessage from './sendRuntimeMessage';
import type { ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const deleteCommands = async (
  currentListName: ListName,
): Promise<RuntimeResponse<'delete-commands'>> => {
  return sendRuntimeMessage({
    type: 'delete-commands',
    message: {
      currentListName,
    },
  });
};

export default deleteCommands;
