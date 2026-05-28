import sendRuntimeMessage from './sendRuntimeMessage';
import type { CommandList } from '../types/domain';

const getList = async (): Promise<CommandList[]> => {
  const response = await sendRuntimeMessage({ type: 'get-list' });

  return response.listData;
};

export default getList;
