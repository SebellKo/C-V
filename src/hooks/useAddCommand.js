import postCommand from '../api/postCommand';
import { useListStore } from '../stores/ListStore';

const useAddCommand = () => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const refresh = useListStore((state) => state.refresh);

  const addCommand = async (newCommand) => {
    const result = await postCommand(newCommand, selectedListId);
    if (result.success) await refresh();
    return result;
  };

  return { addCommand };
};

export default useAddCommand;
