import postList from '../api/postList';
import getList from '../api/getList';
import { useListStore } from '../stores/ListStore';

const useAddList = () => {
  const setLists = useListStore((state) => state.setLists);

  const addList = async (listTitle) => {
    const result = await postList(listTitle);
    if (result.success) setLists(await getList());
    return result;
  };

  return { addList };
};

export default useAddList;
