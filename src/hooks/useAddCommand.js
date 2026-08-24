import postCommand from '../api/postCommand';
import getList from '../api/getList';
import { useListStore } from '../stores/ListStore';

const useAddCommand = () => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const setLists = useListStore((state) => state.setLists);

  const addCommand = async (newCommand) => {
    const result = await postCommand(newCommand, selectedListId);
    if (result.success) setLists(await getList());
    return result;
  };

  return { addCommand };
};

export default useAddCommand;
