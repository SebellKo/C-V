import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandList, ListName } from '../types/domain';

const getListByName = async (
  listName: ListName,
): Promise<CommandList | undefined> => {
  const response = await sendRuntimeMessage({
    type: 'get-list-by-name',
    message: { name: listName },
  });

  return response.listData;
};

export default getListByName;
