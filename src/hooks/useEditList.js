import putEditList from '../api/putEditList';
import { useListStore } from '../stores/ListStore';

const useEditList = () => {
  const refresh = useListStore((state) => state.refresh);

  const editList = async (metadataPatch) => {
    const result = await putEditList(metadataPatch);
    if (result.success) await refresh();
    return result;
  };

  return { editList };
};

export default useEditList;
