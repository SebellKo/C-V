import putEditList from '../api/putEditList';
import getList from '../api/getList';
import { useListStore } from '../stores/ListStore';

const useEditList = () => {
  const setLists = useListStore((state) => state.setLists);

  const editList = async (metadataPatch) => {
    const result = await putEditList(metadataPatch);
    if (result.success) setLists(await getList());
    return result;
  };

  return { editList };
};

export default useEditList;
