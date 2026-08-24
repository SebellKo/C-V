import deleteCommands from '../api/deleteCommands';
import getList from '../api/getList';
import { useListStore } from '../stores/ListStore';

const useDeleteCommands = () => {
  const setLists = useListStore((state) => state.setLists);

  const deleteAllCommands = async (listId) => {
    const result = await deleteCommands(listId);
    if (result.success) setLists(await getList());
    return result;
  };

  return { deleteAllCommands };
};

export default useDeleteCommands;
