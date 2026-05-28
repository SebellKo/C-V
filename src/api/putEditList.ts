import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandList } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const putEditList = async (
  updatedList: CommandList[],
): Promise<RuntimeResponse<'edit-list'>> => {
  return sendRuntimeMessage({
    type: 'edit-list',
    message: { newList: updatedList },
  });
};

export default putEditList;
