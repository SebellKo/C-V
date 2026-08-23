import postList from '../api/postList';
import { useListStore } from '../stores/ListStore';

const useAddList = () => {
  const refresh = useListStore((state) => state.refresh);

  const addList = async (listTitle) => {
    const result = await postList(listTitle);
    if (result.success) await refresh();
    return result;
  };

  return { addList };
};

export default useAddList;
