import { useListStore } from '../stores/ListStore';
import putEditCommand from '../api/putEditCommand';

const useEditCommand = () => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const refresh = useListStore((state) => state.refresh);

  const editCommand = async (selectedCommand, newCommandValue) => {
    const result = await putEditCommand(
      selectedListId,
      selectedCommand,
      newCommandValue,
    );
    if (result.success) await refresh();
    return result;
  };

  return { editCommand };
};

export default useEditCommand;
