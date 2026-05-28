import { useQuery } from '@tanstack/react-query';
import getListByName from '../api/getListByName';
import type { CommandList, ListName } from '../types/domain';

const useGetListByName = (currentListName: ListName) => {
  const { data: list, isSuccess } = useQuery<CommandList | undefined>({
    queryKey: ['list', currentListName],
    queryFn: () => getListByName(currentListName),
    enabled: currentListName !== 'Select',
  });

  return { list, isSuccess };
};

export default useGetListByName;
