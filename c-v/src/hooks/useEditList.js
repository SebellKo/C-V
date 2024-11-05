import { useMutation } from '@tanstack/react-query';
import putEditList from '../api/putEditList';
import { useEditListModalStore } from '../../stores/ModalStore';
import { useListStore } from '../../stores/ListStore';

const useEditList = () => {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const setListName = useListStore((state) => state.setListName);

  const { mutate: editListMutate } = useMutation({
    mutationFn: ({ updatedList }) => putEditList(updatedList),
    onSuccess: () => {
      setListName('Select');
      closeEditModal();
    },
  });

  return { editListMutate };
};

export default useEditList;
