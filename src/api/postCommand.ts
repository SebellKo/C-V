import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandText, ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const postCommand = async (
  newCommand: CommandText,
  currentListName: ListName,
): Promise<RuntimeResponse<'add-new-command'>> => {
  return sendRuntimeMessage({
    type: 'add-new-command',
    message: { newCommand, currentListName },
  });
};

export default postCommand;
