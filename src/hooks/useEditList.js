import { useMutation } from '@tanstack/react-query';
import putEditList from '../api/putEditList';
import { useListStore } from '../stores/ListStore';
import { useEditListModalStore } from '../stores/ModalStore';

const useEditList = (setIsDuplicated) => {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const setListName = useListStore((state) => state.setListName);

  const { mutate: editListMutate } = useMutation({
    mutationFn: ({ updatedList }) => putEditList(updatedList),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      setListName('Select');
      closeEditModal();
    },
  });

  return { editListMutate };
};

export default useEditList;
