import putEditCommands from '../api/putEditCommands';
import getList from '../api/getList';
import { useListStore } from '../stores/ListStore';

const useEditCommands = () => {
  const setLists = useListStore((state) => state.setLists);

  const editCommands = async (listId, updatedCommands) => {
    const result = await putEditCommands(listId, updatedCommands);
    if (result.success) setLists(await getList());
    return result;
  };

  return { editCommands };
};

export default useEditCommands;
