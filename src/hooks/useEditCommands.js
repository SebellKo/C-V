import putEditCommands from '../api/putEditCommands';
import { useListStore } from '../stores/ListStore';

const useEditCommands = () => {
  const refresh = useListStore((state) => state.refresh);

  const editCommands = async (listId, updatedCommands) => {
    const result = await putEditCommands(listId, updatedCommands);
    if (result.success) await refresh();
    return result;
  };

  return { editCommands };
};

export default useEditCommands;
