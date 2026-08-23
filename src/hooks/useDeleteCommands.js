import deleteCommands from '../api/deleteCommands';
import { useListStore } from '../stores/ListStore';

const useDeleteCommands = () => {
  const refresh = useListStore((state) => state.refresh);

  const deleteAllCommands = async (listId) => {
    const result = await deleteCommands(listId);
    if (result.success) await refresh();
    return result;
  };

  return { deleteAllCommands };
};

export default useDeleteCommands;
