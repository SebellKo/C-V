import { useListStore } from '../stores/ListStore';
import getList from '../api/getList';
import putEditCommand from '../api/putEditCommand';

const useEditCommand = () => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const setLists = useListStore((state) => state.setLists);

  const editCommand = async (selectedCommand, newCommandValue) => {
    const result = await putEditCommand(
      selectedListId,
      selectedCommand,
      newCommandValue,
    );
    if (result.success) setLists(await getList());
    return result;
  };

  return { editCommand };
};

export default useEditCommand;
