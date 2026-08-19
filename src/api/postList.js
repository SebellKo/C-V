import { v4 as uuidv4 } from 'uuid';
import sendRuntimeMessage from './sendRuntimeMessage';

const postList = async (listTitle) => {
  return sendRuntimeMessage({
    type: 'add-list',
    message: { listName: listTitle, id: uuidv4() },
  });
};

export default postList;
