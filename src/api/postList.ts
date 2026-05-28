import { v4 as uuidv4 } from 'uuid';
import sendRuntimeMessage from './sendRuntimeMessage';
import type { ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const postList = async (
  listTitle: ListName,
): Promise<RuntimeResponse<'add-list'>> => {
  return sendRuntimeMessage({
    type: 'add-list',
    message: {
      listName: listTitle,
      id: uuidv4(),
    },
  });
};

export default postList;
