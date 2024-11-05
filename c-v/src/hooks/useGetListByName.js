import { useQuery } from '@tanstack/react-query';
import getListByName from '../api/getListByName';
import { useListStore } from '../stores/ListStore';

const useGetListByName = () => {
  const currentListName = useListStore((state) => state.currentListName);

  const { data: list, isSuccess } = useQuery({
    queryKey: ['list', currentListName],
    queryFn: () => getListByName(currentListName),
    enabled: currentListName !== 'Select',
  });

  return { list, isSuccess };
};

export default useGetListByName;
